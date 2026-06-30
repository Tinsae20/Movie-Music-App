"use client";
import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { usePlayerStore } from "@/lib/stores/playerStore";
import PlayerControls from "./PlayerControls";
import VolumeControl from "./VolumeControl";
import Image from "next/image";

export default function AudioPlayer() {
  const howlRef = useRef<Howl | null>(null);
  const { currentSong, isPlaying, volume, repeat, next, setProgress } = usePlayerStore();

  // Rebuild Howl when song changes
  useEffect(() => {
    if (!currentSong) {return;}
    howlRef.current?.unload();
    howlRef.current = new Howl({
      src: [currentSong.audio_url],
      html5: true,
      volume,
      onend: () => {
        if (repeat === "one") {howlRef.current?.play();}
        else {next();}
      },
    });
    howlRef.current.play();
  }, [currentSong?.id]);

  // Sync play/pause
  useEffect(() => {
    if (!howlRef.current) {return;}
    isPlaying ? howlRef.current.play() : howlRef.current.pause();
  }, [isPlaying]);

  // Volume sync
  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  // Progress tick
  useEffect(() => {
    const id = setInterval(() => {
      if (howlRef.current?.playing()) {
        setProgress(howlRef.current.seek() as number);
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  if (!currentSong) {return null;}

  return (
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md px-4 py-3 items-center gap-4">
      {/* Song info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden">
          <Image src={currentSong.cover_url ?? "/placeholder.png"} alt={currentSong.title} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{currentSong.title}</p>
          <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls + seek */}
      <PlayerControls howlRef={howlRef} />

      {/* Volume */}
      <VolumeControl />
    </div>
  );
}
