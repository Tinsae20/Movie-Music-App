import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/lib/types";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const playlistCount = collection.playlists?.length ?? 0;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group relative block overflow-hidden rounded-xl aspect-2/1"
    >
      <Image
        src={collection.cover_url ?? "/placeholder.png"}
        alt={collection.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-lg font-bold leading-tight">{collection.title}</h3>
        {collection.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
            {collection.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {playlistCount} {playlistCount === 1 ? "playlist" : "playlists"}
        </p>
      </div>
    </Link>
  );
}
