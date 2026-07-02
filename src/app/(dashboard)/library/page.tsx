import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SongRow from "@/components/music/SongRow";
import PlaylistCard from "@/components/music/PlaylistCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type FavoriteSongRelation = {
  song: Song | null;
};

type FavoritePlaylistRelation = {
  playlist: PlaylistWithRelations | null;
};

type RecentlyPlayedRelation = {
  song: Song | null;
};

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createClient();

  const [
    { data: favoriteSongs },
    { data: favoritePlaylists },
    { data: recentlyPlayed },
    { data: ownPlaylists },
  ] = await Promise.all([
    (await supabase)
      .from("favorites")
      .select("song:songs(*)")
      .not("song_id", "is", null),
    (await supabase)
      .from("favorites")
      .select("playlist:playlists(*, playlist_songs(song:songs(*)))")
      .not("playlist_id", "is", null),
    (await supabase)
      .from("recently_played")
      .select("song:songs(*)")
      .order("played_at", { ascending: false })
      .limit(20),
    (await supabase)
      .from("playlists")
      .select("*, playlist_songs(song:songs(*))")
      .eq("type", "custom")
      .order("created_at", { ascending: false }),
  ]);

  const songs: Song[] = (favoriteSongs as FavoriteSongRelation[] | null ?? [])
    .map((f) => f.song)
    .filter((song): song is Song => song !== null);

  const recent: Song[] = (recentlyPlayed as RecentlyPlayedRelation[] | null ?? [])
    .map((r) => r.song)
    .filter((song): song is Song => song !== null);

  const normalizePlaylist = (p: PlaylistWithRelations): PlaylistWithSongs => ({
    ...p,
    songs: p.playlist_songs?.map((ps) => ps.song).filter((song): song is Song => song !== null) ?? [],
  });

  const savedPlaylists: PlaylistWithSongs[] = (favoritePlaylists as FavoritePlaylistRelation[] | null ?? [])
    .map((f) => f.playlist)
    .filter((playlist): playlist is PlaylistWithRelations => playlist !== null)
    .map(normalizePlaylist);

  const myPlaylists: PlaylistWithSongs[] = (ownPlaylists as PlaylistWithRelations[] | null ?? []).map(normalizePlaylist);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>

      <Tabs defaultValue="playlists">
        <TabsList>
          <TabsTrigger value="playlists">Playlists ({myPlaylists.length})</TabsTrigger>
          <TabsTrigger value="songs">Liked Songs ({songs.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved Playlists ({savedPlaylists.length})</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {myPlaylists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
          {myPlaylists.length === 0 && (
            <p className="text-muted-foreground text-sm">
              You have not created any playlists yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="songs" className="mt-6">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i + 1} queue={songs} />
          ))}
          {songs.length === 0 && (
            <p className="text-muted-foreground text-sm">No liked songs yet.</p>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {savedPlaylists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
          {savedPlaylists.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No saved playlists yet — favorite a playlist to see it here.
            </p>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          {recent.map((song, i) => (
            <SongRow key={song.id} song={song} index={i + 1} queue={recent} />
          ))}
          {recent.length === 0 && (
            <p className="text-muted-foreground text-sm">Nothing played yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
