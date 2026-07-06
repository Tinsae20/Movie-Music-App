import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const { getToken } = await auth();

  const token = await getToken();
  const supabaseToken = await getToken({ template: "supabase" }).catch(() => null);

  // Test what Supabase sees
  const supabase = createClient();
  const { data: jwtData } = await (await supabase).rpc("get_jwt_claims");

  return Response.json({
    hasDefaultToken: !!token,
    hasSupabaseToken: !!supabaseToken,
    supabaseJwtClaims: jwtData,
  });
}
