import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const curatedCollections = [
  {
    title: "Grandeur & Time",
    description:
      "Monumental orchestral pieces and timeless cinematic compositions that shaped legendary storytelling.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBIs3R5te8457wLbJq7ZS5_nITEHvHyNtf9DA24y3CQ8EIBQ43ZiD8_8zitEHMzRfLz1uGCXPlW-e2t_QONM3cVdgWN000x9J5pGz-1vYwh-nOW3JdLrv22k318LmNOyWz_IB4OQk4bKgHT80ypreK5zjJT9kAOF-cevkmCV-QivAnoMlKm-TsCQbXItwWT2EUDE5ETXkwbgbO6gYEIgOD2yprxvXcoJOR9MJiPmTJ5zMbn9-iB3AXeP4N3BAOQsMe25iWnN_RfTI",
    featured: true,
  },
  {
    title: "Atmospheric Depth",
    description:
      "Ethereal textures, ambient tension, and immersive sonic landscapes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PAg-DxpVFxd6Oz2P4_UCRE37BWFahAdVB2KFuJurFbxfgbnCy9QRc7LiCFkdLQb8-99m7NdpLM77D2Ps5hGFJUzbra9FwbnbNGQ2rU3j-VPE8D7pizeZNL5wC-9Z5j6Y0hhVoRORxqz1I6Adh4k1lGwVfh3fqyeLqXClN2Evyd-eHqaxaoUzoXXTwWTI6FwJbD2s2ZRxtkmmaDFPui1E9Cs-xqo3onGdVFHkGPfNMve0JsVAH4yAiPGudI_8dU8Q-kjweij53d8",
  },
  {
    title: "Fantasy Epics",
    description:
      "Heroic themes and mythical worlds brought to life through cinematic orchestration.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgUtLJGKzHBr0msYdnVnMmhAUtpaYqMnao6u_fGqFCLZVUwvr3aBNF5hC1wGTly-LdTn00jlyhEFdIe8SDXiPUGiK0s4_bvTBEQThnMXn0oZZ-vGtl1g61RxqIuoWgZBrG_X4KIzUE-qBi67OOZrDeg6QYRVuXuJk0bYf0uUCaVKT8aPsjCrmgHJS9CDBiNPvXHNmWwj8N3alIZRE4VL45d-oGG2yWMEgS0Mlmk1qcRwb_pr_7zPTVVBuGukogsHNferK-mHJVfTo",
  },
  {
    title: "Classic Scores",
    description:
      "Legendary soundtracks that defined generations of cinema and continue to inspire filmmakers worldwide.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiOME944kQk_JLg4nUWjS9Zmfi-WvKZGJULf_qGV_VjJ1dLeq2ktMPiBnr23R0XBNi2B55xoLNykx4RIrcknJjetkatRkBbkxEKqDXkLysyoapcWyXlckxE-Li_vw87FnxK-qa1AqfRpGq5j69Fhd5iT0GIpyrME6QmYcxEEbiYn07k-JSUairs5fHOn8IIxWCsvBZeidiKv17r05KEIoneksImjQ5ugNWNAK76Gmz4hzxzByOYCKg0CQonKr4__Hb3FJDmJToFdo",
    large: true,
  },
];

export default function CuratedCollections() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 max-w-3xl">
        <h2 className="text-4xl font-bold">
      Curated by Visionaries
        </h2>

        <p className="mt-4 text-lg leading-8 text-muted-foreground">
      Explore collections hand-picked by world-renowned directors,
      showcasing the music that inspired their most iconic scenes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* FEATURED LEFT CARD */}
        <div className="group relative overflow-hidden rounded-3xl border border-border lg:row-span-2">
          <div className="relative h-full min-h-160 w-full">
            <Image
              src={curatedCollections[0].image}
              alt={curatedCollections[0].title}
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mb-4 inline-flex rounded-full border border-border bg-background/60 px-3 py-1 text-xs tracking-widest backdrop-blur-md">
          FEATURED COLLECTION
            </div>

            <h3 className="text-4xl font-black">
              {curatedCollections[0].title}
            </h3>

            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              {curatedCollections[0].description}
            </p>

            <Button className="mt-6 rounded-full px-6">
              <Play className="mr-2 h-4 w-4 fill-current" />
          Listen To Collection
            </Button>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
          {curatedCollections.slice(1).map((collection) => (
            <div
              key={collection.title}
              className={`group relative overflow-hidden rounded-3xl border border-border ${
                collection.large ? "lg:col-span-2" : ""
              }`}
            >
              <div className="relative h-77.5 w-full">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold">
                  {collection.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {collection.description}
                </p>

                <button className="mt-5 inline-flex items-center text-sm font-medium text-primary transition hover:opacity-80">
              Listen To Collection
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
