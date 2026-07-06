import { createClient } from "@/lib/supabase/server";
import CollectionCard from "@/components/music/CollectionCard";
import type { Collection, Playlist } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import CreateCollectionDialog from "@/components/music/CreateCollectionDialog";

export const revalidate = 0;

type CollectionPlaylistRelation = {
  playlist: Playlist | null;
};

type CollectionWithRelations = Collection & {
  collection_playlists?: CollectionPlaylistRelation[];
};

type CollectionWithPlaylists = Collection & {
  playlists: Playlist[];
};

export default async function CollectionsPage() {
  const { userId } = await auth();
  const supabase = createClient();
  const { data: collections, error } = await (await supabase)
    .from("collections")
    .select("*, collection_playlists(playlist:playlists(*))")
    .order("title");

  if (error) {console.error("Failed to load collections:", error.message);}

  // Flatten collection_playlists(playlist:playlists(*)) into the
  // `playlists: Playlist[]` shape CollectionCard expects (Section 11).
  const normalized: CollectionWithPlaylists[] =
    (
      collections as CollectionWithRelations[] | null
    )?.map((collection) => ({
      ...collection,

      playlists:
        collection.collection_playlists
          ?.map((relation) => relation.playlist)
          .filter(
            (
              playlist,
            ): playlist is Playlist =>
              playlist !== null,
          ) ?? [],
    })) ?? [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        {userId && <CreateCollectionDialog />}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {normalized.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}

