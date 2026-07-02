"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";

// ─── Song Favorites ────────────────────────────────────────────────────────

export function useFavoriteSong(songId: string) {
  const { user } = useUser();
  const supabase = createClient();
  const qc = useQueryClient();

  const { data: isFav = false } = useQuery({
    queryKey: ["favorite-song", songId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("song_id", songId)
        .maybeSingle(); // avoids throwing when row doesn't exist
      return !!data;
    },
    enabled: !!user,
  });

  const toggle = useMutation({
    // Flip the heart immediately before the server responds
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["favorite-song", songId, user?.id] });
      const previous = qc.getQueryData(["favorite-song", songId, user?.id]);
      qc.setQueryData(["favorite-song", songId, user?.id], !isFav);
      return { previous };
    },
    mutationFn: async () => {
      if (isFav) {
        // Remove from favorites table
        await supabase
          .from("favorites")
          .delete()
          .eq("song_id", songId);

        // Also remove from the user's Favorites playlist
        const { data: favPlaylist } = await supabase
          .from("playlists")
          .select("id")
          .eq("type", "favorites")
          .maybeSingle();

        if (favPlaylist) {
          await supabase
            .from("playlist_songs")
            .delete()
            .eq("playlist_id", favPlaylist.id)
            .eq("song_id", songId);
        }
      } else {
        // Add to favorites table
        await supabase
          .from("favorites")
          .insert({ song_id: songId });

        // Also add to the user's Favorites playlist
        const { data: favPlaylist } = await supabase
          .from("playlists")
          .select("id")
          .eq("type", "favorites")
          .maybeSingle();

        if (favPlaylist) {
          const { data: lastPos } = await supabase
            .from("playlist_songs")
            .select("position")
            .eq("playlist_id", favPlaylist.id)
            .order("position", { ascending: false })
            .limit(1)
            .maybeSingle();

          await supabase
            .from("playlist_songs")
            .insert({
              playlist_id: favPlaylist.id,
              song_id: songId,
              position: (lastPos?.position ?? 0) + 1,
            });
        }
      }
    },
    // Roll back optimistic update on error
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
  const supabase = createClient();
  const qc = useQueryClient();

  const { data: isFav = false } = useQuery({
    queryKey: ["favorite-playlist", playlistId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
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
      if (isFav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("playlist_id", playlistId);
      } else {
        await supabase
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
