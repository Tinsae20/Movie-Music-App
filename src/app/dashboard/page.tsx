import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import MovieCard from "@/components/music/MovieCard";
import CollectionCard from "@/components/music/CollectionCard";
import SongRow from "@/components/music/SongRow";
import type { Song } from "@/lib/types";

type RecentlyPlayedRow = {
  song: (Omit<Song, "movie"> & { movie: { title: string } | null }) | null;
};

export default async function HomePage() {
  const { userId } = await auth();
  const supabase = createClient();

  // Run independent queries concurrently
  const [{ data: movies }, { data: collections }, recentlyPlayedResult] =
    await Promise.all([
      (await supabase)
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      (await supabase)
        .from("collections")
        .select("*, collection_playlists(playlist:playlists(*))")
        .limit(6),
      userId
        ? (await supabase)
          .from("recently_played")
          .select("song:songs(*, movie:movies(title))")
          .order("played_at", { ascending: false })
          .limit(5)
        : Promise.resolve({ data: null }),
    ]);

  // Supabase infers `song` as an array here because it can't tell the
  // songs<->recently_played relationship is one-to-one from the select
  // string alone — cast the whole result rather than fighting that inference.
  const recentlyPlayed = recentlyPlayedResult.data as RecentlyPlayedRow[] | null;

  const recentSongs: Song[] =
  recentlyPlayed
    ?.map((r) => r.song)
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .map(
      (song) =>
        ({
          ...song,
          movie: song.movie ?? undefined,
        }) as Song,
    ) ?? [];

  return (
    <div className="p-6 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-1">
          {userId ? "Welcome back" : "Discover movie soundtracks"}
        </h1>
        <p className="text-muted-foreground">
          Pick up where you left off, or explore new soundtracks.
        </p>
      </section>

      {/* Continue listening — only for signed-in users with history */}
      {recentSongs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Continue Listening</h2>
          {recentSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i + 1} queue={recentSongs} />
          ))}
        </section>
      )}

      {/* Featured movie soundtracks */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Soundtracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      {/* Curated collections */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Curated Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections?.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
}
