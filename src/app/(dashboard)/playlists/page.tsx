import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import PlaylistCard from "@/components/music/PlaylistCard";
import type { Playlist, Song } from "@/lib/types";
type PlaylistSongRelation = {
  song: Song | null;
};

type PlaylistWithRelations = Playlist & {
  playlist_songs?: PlaylistSongRelation[];
};

type PlaylistWithSongs = Playlist & {
  songs: Song[];
};

export default async function PlaylistsPage() {
  const { userId } = await auth();
  const supabase = createClient();

  // Two separate queries rather than one OR-filter: keeps RLS doing the
  // access-control work per table rather than re-deriving it client-side.
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

  // Normalize the nested `playlist_songs(song:songs(*))` shape into the
  // flatter `songs: Song[]` shape that PlaylistCard expects (Section 11).
  const normalize = (
    rows: PlaylistWithRelations[] | null,
  ): PlaylistWithSongs[] =>
    (rows ?? []).map((playlist) => ({
      ...playlist,

      songs:
        playlist.playlist_songs
          ?.map((relation) => relation.song)
          .filter(
            (song): song is Song => song !== null,
          ) ?? [],
    }));

  const yourPlaylists = normalize(ownPlaylists);
  const movieSoundtracks = normalize(moviePlaylists);

  return (
    <div className="p-6 space-y-10">
      {yourPlaylists.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {yourPlaylists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Movie Soundtracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movieSoundtracks.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
