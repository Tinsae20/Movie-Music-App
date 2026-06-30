import { createClient } from "@/lib/supabase/server";
import PlaylistCard from "@/components/music/PlaylistCard";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Collection, Playlist, Song } from "@/lib/types";

type PlaylistSongRelation = {
  song: Song | null;
};

type PlaylistWithRelations = Playlist & {
  playlist_songs?: PlaylistSongRelation[];
};

type PlaylistWithSongs = Playlist & {
  songs: Song[];
};

type CollectionPlaylistRelation = {
  playlist: PlaylistWithRelations | null;
};

type CollectionWithRelations = Collection & {
  collection_playlists?: CollectionPlaylistRelation[];
};

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const { data: collection, error } = await (await supabase)
    .from("collections")
    .select("*, collection_playlists(playlist:playlists(*, playlist_songs(song:songs(*))))")
    .eq("id", id)
    .single();

  if (error) {console.error("Failed to load collection:", error.message);}
  if (!collection) {notFound();}


  const typedCollection =
    collection as CollectionWithRelations;

  const playlists: PlaylistWithSongs[] =
    typedCollection.collection_playlists
      ?.map((relation) => relation.playlist)
      .filter(
        (
          playlist,
        ): playlist is PlaylistWithRelations =>
          playlist !== null,
      )
      .map((playlist) => ({
        ...playlist,

        songs:
          playlist.playlist_songs
            ?.map((relation) => relation.song)
            .filter(
              (
                song,
              ): song is Song =>
                song !== null,
            ) ?? [],
      })) ?? [];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 w-full">
        <Image
          src={collection.cover_url ?? "/placeholder.png"}
          alt={collection.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="text-muted-foreground mt-1">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Playlists in this collection */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((p: PlaylistWithSongs) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
