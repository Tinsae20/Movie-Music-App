// src/components/music/PlaylistCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ListMusic, Heart } from "lucide-react";
import { useFavoritePlaylist } from "@/lib/hooks/useFavorites";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import type { Playlist } from "@/lib/types";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { user } = useUser();
  const { isFav, toggle, isPending } = useFavoritePlaylist(playlist.id);
  const songCount = playlist.songs?.length ?? 0;
  const coverSong = playlist.songs?.[0];
  const isFavorites = playlist.type === "favorites";

  return (
    <div className="group relative block">
      <Link href={`/playlists/${playlist.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
          {isFavorites ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/40 to-primary/10">
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

      {/* Favorite button — only shown for non-favorites playlists to signed-in users */}
      {user && !isFavorites && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          disabled={isPending}
          aria-label={isFav ? "Remove from saved playlists" : "Save playlist"}
          className={cn(
            "absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full",
            "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
            isPending && "opacity-50 cursor-not-allowed",
          )}
        >
          <Heart
            size={14}
            className={cn(isFav ? "fill-primary text-primary" : "text-muted-foreground")}
          />
        </button>
      )}
    </div>
  );
}
