import Image from "next/image";

const featuredSoundtracks = [
  {
    title: "SOLARIS ECHOES",
    artist: "Hans Zimmer, Benjamin Wallfisch",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBIs3R5te8457wLbJq7ZS5_nITEHvHyNtf9DA24y3CQ8EIBQ43ZiD8_8zitEHMzRfLz1uGCXPlW-e2t_QONM3cVdgWN000x9J5pGz-1vYwh-nOW3JdLrv22k318LmNOyWz_IB4OQk4bKgHT80ypreK5zjJT9kAOF-cevkmCV-QivAnoMlKm-TsCQbXItwWT2EUDE5ETXkwbgbO6gYEIgOD2yprxvXcoJOR9MJiPmTJ5zMbn9-iB3AXeP4N3BAOQsMe25iWnN_RfTI",
  },
  {
    title: "VELVET SECRETS",
    artist: "Alexandre Desplat",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PAg-DxpVFxd6Oz2P4_UCRE37BWFahAdVB2KFuJurFbxfgbnCy9QRc7LiCFkdLQb8-99m7NdpLM77D2Ps5hGFJUzbra9FwbnbNGQ2rU3j-VPE8D7pizeZNL5wC-9Z5j6Y0hhVoRORxqz1I6Adh4k1lGwVfh3fqyeLqXClN2Evyd-eHqaxaoUzoXXTwWTI6FwJbD2s2ZRxtkmmaDFPui1E9Cs-xqo3onGdVFHkGPfNMve0JsVAH4yAiPGudI_8dU8Q-kjweij53d8",
  },
  {
    title: "KINETIC PULSE",
    artist: "Ludwig Göransson",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgUtLJGKzHBr0msYdnVnMmhAUtpaYqMnao6u_fGqFCLZVUwvr3aBNF5hC1wGTly-LdTn00jlyhEFdIe8SDXiPUGiK0s4_bvTBEQThnMXn0oZZ-vGtl1g61RxqIuoWgZBrG_X4KIzUE-qBi67OOZrDeg6QYRVuXuJk0bYf0uUCaVKT8aPsjCrmgHJS9CDBiNPvXHNmWwj8N3alIZRE4VL45d-oGG2yWMEgS0Mlmk1qcRwb_pr_7zPTVVBuGukogsHNferK-mHJVfTo",
  },
  {
    title: "FRACTURED MIND",
    artist: "Hildur Guðnadóttir",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiOME944kQk_JLg4nUWjS9Zmfi-WvKZGJULf_qGV_VjJ1dLeq2ktMPiBnr23R0XBNi2B55xoLNykx4RIrcknJjetkatRkBbkxEKqDXkLysyoapcWyXlckxE-Li_vw87FnxK-qa1AqfRpGq5j69Fhd5iT0GIpyrME6QmYcxEEbiYn07k-JSUairs5fHOn8IIxWCsvBZeidiKv17r05KEIoneksImjQ5ugNWNAK76Gmz4hzxzByOYCKg0CQonKr4__Hb3FJDmJToFdo",
  },
];

export default function FeaturedSoundtracks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
          Featured Soundtracks
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featuredSoundtracks.map((soundtrack) => (
          <div
            key={soundtrack.title}
            className="group overflow-hidden rounded-3xl border border-border"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={soundtrack.image}
                alt={soundtrack.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            <div className="p-5">
              <h3 className="font-bold">
                {soundtrack.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {soundtrack.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
