"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";

export function useFavoriteSong(songId: string) {
  const { user } = useUser();
  const supabase = createClient();
  const qc = useQueryClient();

  const { data: isFav } = useQuery({
    queryKey: ["favorite-song", songId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("song_id", songId)
        .single();
      return !!data;
    },
    enabled: !!user,
  });

  const toggle = useMutation({
    mutationFn: async () => {
      if (isFav) {
        await supabase.from("favorites").delete().eq("song_id", songId);
      } else {
        await supabase.from("favorites").insert({ song_id: songId });
        // Also add to Favorites playlist
        const { data: fav } = await supabase
          .from("playlists")
          .select("id")
          .eq("type", "favorites")
          .single();
        if (fav) {
          await supabase.from("playlist_songs").insert({ playlist_id: fav.id, song_id: songId });
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorite-song", songId] }),
  });

  return { isFav, toggle: toggle.mutate };
}
