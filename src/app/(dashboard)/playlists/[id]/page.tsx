"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import SongRow from "@/components/music/SongRow";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Song } from "@/lib/types";

// Shape returned by the `playlist_songs(position, song:songs(*))` select below
type PlaylistSongRow = {
  position: number;
  song: Song | null;
};

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const { data } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("playlists")
        .select("*, playlist_songs(position, song:songs(*))")
        .eq("id", id)
        .single();
      return data;
    },
  });

  const songs: Song[] =
    (data?.playlist_songs as PlaylistSongRow[] | undefined)
      ?.sort((a, b) => a.position - b.position)
      .map((ps) => ps.song)
      .filter((s): s is Song => s !== null) ?? [];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{data?.name}</h1>
          <p className="text-muted-foreground">{songs.length} songs</p>
        </div>
        {data?.type === "custom" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Pencil size={14} className="mr-1" />Rename</Button>
            <Button variant="destructive" size="sm"><Trash2 size={14} className="mr-1" />Delete</Button>
          </div>
        )}
      </div>

      {songs.map((song, i) => (
        <SongRow key={song.id} song={song} index={i + 1} queue={songs} />
      ))}
    </div>
  );
}
