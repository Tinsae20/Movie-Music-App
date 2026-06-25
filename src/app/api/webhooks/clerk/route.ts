import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { WebhookEvent } from "@clerk/backend";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();
  const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!clerkWebhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }
  const wh = new Webhook(clerkWebhookSecret);
  const event = wh.verify(payload, {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  }) as WebhookEvent;

  const supabase =  await createClient({ serviceRole: true });

  if (event.type === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name } = event.data;
    await supabase.from("users").insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      display_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      avatar_url: image_url,
    });
  }

  if (event.type === "user.updated") {
    const { id, image_url, first_name, last_name } = event.data;
    await supabase.from("users").update({
      display_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      avatar_url: image_url,
    }).eq("clerk_id", id);
  }

  if (event.type === "user.deleted") {
    await supabase.from("users").delete().eq("clerk_id", event.data.id);
  }

}

