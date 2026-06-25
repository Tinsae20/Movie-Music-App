import { createClient } from "@/lib/supabase/server";
import MovieCard from "@/components/music/MovieCard";

export default async function MoviesPage() {
  const supabase = createClient();
  const { data: movies } = await (await supabase).from("movies").select("*").order("title");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}
