"use client";
import { useState } from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { Slider } from "@/components/ui/slider";

export default function VolumeControl() {
  const { volume, setVolume } = usePlayerStore();
  const [prevVolume, setPrevVolume] = useState(volume);

  function toggleMute() {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.5);
    }
  }

  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="hidden md:flex w-32 items-center gap-2 shrink-0">
      <button onClick={toggleMute} aria-label={volume === 0 ? "Unmute" : "Mute"}>
        <Icon size={18} className="text-muted-foreground" />
      </button>
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onValueChange={(v) => setVolume(v[0] / 100)}
        className="flex-1"
      />
    </div>
  );
}
