"use client";
import { useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipForward, ChevronUp, X } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { Progress } from "@/components/ui/progress";

export default function MiniPlayer() {
  const { currentSong, isPlaying, progress, togglePlay, next } = usePlayerStore();
  const [expanded, setExpanded] = useState(false);

  if (!currentSong) {return null;}

  const progressPct = currentSong.duration_secs
    ? Math.min(100, (progress / currentSong.duration_secs) * 100)
    : 0;

  return (
    <>
      {/* Collapsed bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md"
        onClick={() => setExpanded(true)}
      >
        <Progress value={progressPct} className="h-0.5 rounded-none" />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
            <Image
              src={currentSong.cover_url ?? "/placeholder.png"}
              alt={currentSong.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{currentSong.title}</p>
            <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next song"
          >
            <SkipForward size={18} />
          </button>
          <ChevronUp size={16} className="text-muted-foreground" />
        </div>
      </div>

      {/* Expanded full-screen view */}
      {expanded && (
        <div className="md:hidden fixed inset-0 z-60 flex flex-col bg-background p-6">
          <button
            onClick={() => setExpanded(false)}
            aria-label="Close now playing"
            className="self-end"
          >
            <X size={22} />
          </button>

          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="relative h-72 w-72 max-w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={currentSong.cover_url ?? "/placeholder.png"}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{currentSong.title}</h2>
              <p className="text-muted-foreground">{currentSong.artist}</p>
            </div>

            <Progress value={progressPct} className="w-full max-w-sm h-1.5" />

            <div className="flex items-center gap-8">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                {isPlaying ? <Pause size={26} /> : <Play size={26} />}
              </button>
              <button onClick={next} aria-label="Next song">
                <SkipForward size={26} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
