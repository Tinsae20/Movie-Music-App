"use client";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const playSong = usePlayerStore((s) => s.playSong);

  async function handlePlaySoundtrack(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const supabase = createClient();
    const { data: songs } = await supabase
      .from("songs")
      .select("*")
      .eq("movie_id", movie.id)
      .order("title");
    if (songs && songs.length > 0) {
      playSong(songs[0], songs);
    }
  }

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={movie.cover_url ?? "/placeholder.png"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
        <button
          onClick={handlePlaySoundtrack}
          aria-label={`Play ${movie.title} soundtrack`}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
        >
          <Play size={16} className="fill-current" />
        </button>
      </div>
      <p className="mt-2 truncate text-sm font-medium">{movie.title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {movie.release_year} {movie.genre ? `· ${movie.genre}` : ""}
      </p>
    </Link>
  );
}
