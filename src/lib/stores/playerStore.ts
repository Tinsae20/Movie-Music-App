import { create } from "zustand";
import { Song } from "@/lib/types";

type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  progress: number;

  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setProgress: (secs: number) => void;
  addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  isShuffle: false,
  repeat: "off",
  volume: 0.8,
  progress: 0,

  playSong(song, queue) {
    const q = queue ?? [song];
    const idx = q.findIndex((s) => s.id === song.id);
    set({ currentSong: song, queue: q, queueIndex: idx >= 0 ? idx : 0, isPlaying: true, progress: 0 });
  },

  togglePlay() {
    set((s) => ({ isPlaying: !s.isPlaying }));
  },

  next() {
    const { queue, queueIndex, isShuffle, repeat } = get();
    let next = queueIndex + 1;
    if (isShuffle) {next = Math.floor(Math.random() * queue.length);}
    if (next >= queue.length) {
      if (repeat === "all") {next = 0;}
      else { set({ isPlaying: false }); return; }
    }
    set({ queueIndex: next, currentSong: queue[next], progress: 0 });
  },

  prev() {
    const { queue, queueIndex, progress } = get();
    if (progress > 3) { set({ progress: 0 }); return; }
    const prev = Math.max(0, queueIndex - 1);
    set({ queueIndex: prev, currentSong: queue[prev], progress: 0 });
  },

  seek(seconds) { set({ progress: seconds }); },
  setVolume(volume) { set({ volume }); },
  setProgress(progress) { set({ progress }); },
  toggleShuffle() { set((s) => ({ isShuffle: !s.isShuffle })); },
  cycleRepeat() {
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  },
  addToQueue(song) {
    set((s) => ({ queue: [...s.queue, song] }));
  },
}));
