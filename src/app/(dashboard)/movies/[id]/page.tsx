import { createClient } from "@/lib/supabase/server";
import SongRow from "@/components/music/SongRow";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const [{ data: movie, error: movieError }, { data: songs, error: songsError }] =
    await Promise.all([
      (await supabase).from("movies").select("*").eq("id", id).single(),
      (await supabase).from("songs").select("*").eq("movie_id", id).order("title"),
    ]);

  if (movieError) {console.error("Failed to load movie:", movieError.message);}
  if (songsError) {console.error("Failed to load songs:", songsError.message);}

  if (!movie) {notFound();}

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 w-full">
        <Image src={movie.cover_url ?? "/placeholder.png"} alt={movie.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-muted-foreground">{movie.release_year} · {movie.genre}</p>
        </div>
      </div>

      {/* Song list */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Soundtrack ({songs?.length ?? 0} songs)</h2>
        {songs?.map((song, i) => (
          <SongRow key={song.id} song={song} index={i + 1} queue={songs} />
        ))}
      </div>
    </div>
  );
}
