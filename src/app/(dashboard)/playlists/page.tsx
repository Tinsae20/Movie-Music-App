import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import PlaylistCard from "@/components/music/PlaylistCard";
import type { Playlist, Song } from "@/lib/types";

type PlaylistSongRelation = {
  song: Song | null;
};

type PlaylistWithRelations = Omit<Playlist, "songs"> & {
  playlist_songs?: PlaylistSongRelation[];
};

export default async function PlaylistsPage() {
  const { userId } = await auth();
  const supabase = createClient();

  const [{ data: ownPlaylists }, { data: moviePlaylists }] = await Promise.all([
    userId
      ? (await supabase)
        .from("playlists")
        .select("*, playlist_songs(song:songs(*))")
        .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
    (await supabase)
      .from("playlists")
      .select("*, playlist_songs(song:songs(*))")
      .eq("type", "movie")
      .eq("is_public", true)
      .order("name"),
  ]);

  const normalize = (rows: PlaylistWithRelations[] | null): Playlist[] =>
    (rows ?? []).map((playlist) => ({
      ...playlist,
      songs: playlist.playlist_songs
        ?.map((r) => r.song)
        .filter((s): s is Song => s !== null) ?? [],
    }));

  const yourPlaylists = normalize(ownPlaylists as PlaylistWithRelations[] | null);
  const movieSoundtracks = normalize(moviePlaylists as PlaylistWithRelations[] | null);

  const favorites = yourPlaylists.filter((p) => p.type === "favorites");
  const custom = yourPlaylists.filter((p) => p.type === "custom");

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Playlists</h1>

      {favorites.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}

      {custom.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {custom.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">Movie Soundtracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movieSoundtracks.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
        {movieSoundtracks.length === 0 && (
          <p className="text-muted-foreground text-sm">No soundtracks found.</p>
        )}
      </section>
    </div>
  );
}
