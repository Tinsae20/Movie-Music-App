"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient, createAuthClient } from "@/lib/supabase/client";
import { useUser, useAuth } from "@clerk/nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

type GetTokenFn = (options?: { template?: string }) => Promise<string | null>;

async function getAuthenticatedClient(getToken: GetTokenFn): Promise<SupabaseClient> {
  const token = await getToken({ template: "supabase" });

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])) as Record<string, unknown>;
    console.log("JWT payload:", payload);
  }

  return token ? createAuthClient(token) : createClient();
}

// ─── Song Favorites ────────────────────────────────────────────────────────

export function useFavoriteSong(songId: string) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const qc = useQueryClient();

  const { data: isFav = false } = useQuery({
    queryKey: ["favorite-song", songId, user?.id],
    queryFn: async () => {
      const client = await getAuthenticatedClient(getToken);
      const { data } = await client
        .from("favorites")
        .select("id")
        .eq("song_id", songId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggle = useMutation({
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["favorite-song", songId, user?.id] });
      const previous = qc.getQueryData(["favorite-song", songId, user?.id]);
      qc.setQueryData(["favorite-song", songId, user?.id], !isFav);
      return { previous };
    },
    mutationFn: async () => {
      // Get authenticated client once and reuse across all operations
      const client = await getAuthenticatedClient(getToken);

      if (isFav) {
        await client
          .from("favorites")
          .delete()
          .eq("song_id", songId);

        const { data: favPlaylist } = await client
          .from("playlists")
          .select("id")
          .eq("type", "favorites")
          .maybeSingle();

        if (favPlaylist) {
          await client
            .from("playlist_songs")
            .delete()
            .eq("playlist_id", favPlaylist.id)
            .eq("song_id", songId);
        }
      } else {
        await client
          .from("favorites")
          .insert({ song_id: songId });

        const { data: favPlaylist } = await client
          .from("playlists")
          .select("id")
          .eq("type", "favorites")
          .maybeSingle();

        if (favPlaylist) {
          const { data: lastPos } = await client
            .from("playlist_songs")
            .select("position")
            .eq("playlist_id", favPlaylist.id)
            .order("position", { ascending: false })
            .limit(1)
            .maybeSingle();

          await client
            .from("playlist_songs")
            .insert({
              playlist_id: favPlaylist.id,
              song_id: songId,
              position: (lastPos?.position ?? 0) + 1,
            });
        }
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["favorite-song", songId, user?.id], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favorite-song", songId] });
      qc.invalidateQueries({ queryKey: ["library-favorites"] });
    },
  });

  return { isFav, toggle: toggle.mutate, isPending: toggle.isPending };
}

// ─── Playlist Favorites ────────────────────────────────────────────────────

export function useFavoritePlaylist(playlistId: string) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const qc = useQueryClient();

  const { data: isFav = false } = useQuery({
    queryKey: ["favorite-playlist", playlistId, user?.id],
    queryFn: async () => {
      const client = await getAuthenticatedClient(getToken);
      const { data } = await client
        .from("favorites")
        .select("id")
        .eq("playlist_id", playlistId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggle = useMutation({
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["favorite-playlist", playlistId, user?.id] });
      const previous = qc.getQueryData(["favorite-playlist", playlistId, user?.id]);
      qc.setQueryData(["favorite-playlist", playlistId, user?.id], !isFav);
      return { previous };
    },
    mutationFn: async () => {
      const client = await getAuthenticatedClient(getToken);

      if (isFav) {
        await client
          .from("favorites")
          .delete()
          .eq("playlist_id", playlistId);
      } else {
        await client
          .from("favorites")
          .insert({ playlist_id: playlistId });
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["favorite-playlist", playlistId, user?.id], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favorite-playlist", playlistId] });
      qc.invalidateQueries({ queryKey: ["library-favorites"] });
    },
  });

  return { isFav, toggle: toggle.mutate, isPending: toggle.isPending };
}
