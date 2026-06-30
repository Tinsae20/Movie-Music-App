"use client";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { Song } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export default function SongCard({ song, queue }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const isCurrent = currentSong?.id === song.id;

  function handleClick() {
    if (isCurrent) {togglePlay();}
    else {playSong(song, queue ?? [song]);}
  }

  return (
    <button
      onClick={handleClick}
      className="group w-36 shrink-0 text-left"
      aria-label={`Play ${song.title}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={song.cover_url ?? song.movie?.cover_url ?? "/placeholder.png"}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100",
              isCurrent && "opacity-100",
            )}
          >
            {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
          </div>
        </div>
      </div>
      <p className={cn("mt-2 truncate text-sm font-medium", isCurrent && "text-primary")}>
        {song.title}
      </p>
      <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
    </button>
  );
}
