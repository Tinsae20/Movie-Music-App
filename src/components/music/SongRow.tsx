"use client";
import Image from "next/image";
import { Play, Pause, Heart } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { useFavoriteSong } from "@/lib/hooks/useFavorites";
import { Song } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SongRowProps {
  song: Song;
  index: number;
  queue: Song[];
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SongRow({ song, index, queue }: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const { isFav, toggle } = useFavoriteSong(song.id);

  const isCurrent = currentSong?.id === song.id;

  function handlePlayPause() {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  }

  return (
    <div
      onClick={handlePlayPause}
      className={cn(
        "group flex items-center gap-4 rounded-md px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors",
        isCurrent && "bg-secondary/70",
      )}
    >
      {/* Index / play indicator */}
      <div className="w-6 text-center text-sm text-muted-foreground shrink-0">
        <span className="group-hover:hidden">
          {isCurrent && isPlaying ? (
            <span className="text-primary">♪</span>
          ) : (
            index
          )}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className="hidden group-hover:inline-flex items-center justify-center"
          aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
        >
          {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>

      {/* Cover */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
        <Image
          src={song.cover_url ?? song.movie?.cover_url ?? "/placeholder.png"}
          alt={song.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title / artist */}
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", isCurrent && "text-primary")}>
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {song.artist}
          {song.movie?.title ? ` · ${song.movie.title}` : ""}
        </p>
      </div>

      {/* Favorite toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={16} className={cn(isFav && "fill-primary text-primary")} />
      </button>

      {/* Duration */}
      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
        {formatDuration(song.duration_secs)}
      </span>
    </div>
  );
}
