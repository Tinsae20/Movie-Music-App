"use client";
import { useState, useEffect, type RefObject } from "react";
import { Howl } from "howler";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  howlRef: RefObject<Howl | null>;
}

function formatTime(secs: number) {
  if (!isFinite(secs) || secs < 0) {return "0:00";}
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerControls({ howlRef }: PlayerControlsProps) {
  const {
    isPlaying,
    isShuffle,
    repeat,
    progress,
    currentSong,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    seek,
  } = usePlayerStore();

  const [duration, setDuration] = useState(0);

  // Howler reports duration only once the file is loaded
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) {return;}
    if (howl.state() === "loaded") {
      setDuration(howl.duration());
    } else {
      howl.once("load", () => setDuration(howl.duration()));
    }
  }, [howlRef, currentSong?.id]);

  function handleSeek(value: number[]) {
    const next = value[0];
    seek(next);
    howlRef.current?.seek(next);
  }

  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="flex flex-1 flex-col items-center gap-2 max-w-xl">
      <div className="flex items-center gap-5">
        <button
          onClick={toggleShuffle}
          aria-label="Toggle shuffle"
          aria-pressed={isShuffle}
        >
          <Shuffle size={16} className={cn("text-muted-foreground", isShuffle && "text-primary")} />
        </button>

        <button onClick={prev} aria-label="Previous song">
          <SkipBack size={18} className="text-foreground" />
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button onClick={next} aria-label="Next song">
          <SkipForward size={18} className="text-foreground" />
        </button>

        <button
          onClick={cycleRepeat}
          aria-label="Cycle repeat mode"
          aria-pressed={repeat !== "off"}
        >
          <RepeatIcon size={16} className={cn("text-muted-foreground", repeat !== "off" && "text-primary")} />
        </button>
      </div>

      <div className="flex w-full items-center gap-2">
        <span className="w-10 text-right text-xs text-muted-foreground">
          {formatTime(progress)}
        </span>
        <Slider
          value={[progress]}
          max={duration || 1}
          step={1}
          onValueChange={handleSeek}
          className="flex-1"
        />
        <span className="w-10 text-xs text-muted-foreground">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
