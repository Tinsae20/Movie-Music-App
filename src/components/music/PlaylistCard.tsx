import Link from "next/link";
import Image from "next/image";
import { ListMusic, Heart } from "lucide-react";
import { Playlist } from "@/lib/types";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const songCount = playlist.songs?.length ?? 0;
  const coverSong = playlist.songs?.[0];
  const isFavorites = playlist.type === "favorites";

  return (
    <Link href={`/playlists/${playlist.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        {isFavorites ? (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/40 to-primary/10">
            <Heart size={32} className="fill-primary text-primary" />
          </div>
        ) : coverSong?.cover_url ? (
          <Image
            src={coverSong.cover_url}
            alt={playlist.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ListMusic size={28} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-medium">{playlist.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {songCount} {songCount === 1 ? "song" : "songs"}
        {!playlist.is_public && " · Private"}
      </p>
    </Link>
  );
}
