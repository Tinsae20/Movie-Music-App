import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@clerk/nextjs";

export async function useSupabaseClient() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getToken } = useAuth();

  const clerkToken = await getToken({ template: "supabase" });
  console.log("Clerk token:", clerkToken ? "✓ received" : "✗ null");

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const headers = new Headers(options.headers);
          try {
            const clerkToken = await getToken({ template: "supabase" });
            if (clerkToken) {
              headers.set("Authorization", `Bearer ${clerkToken}`);
            }
          } catch {
            // Not signed in or template missing — proceed without auth header
          }
          return fetch(url, { ...options, headers });
        },
      },
    },
  );
}

export const createAuthClient = (token: string) =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
