import Image from "next/image";
import { MoreVertical } from "lucide-react";

const tracks = [
  {
    id: "01",
    title: "Time (Inception)",
    artist: "Hans Zimmer",
    genre: "FILM SCORE",
    quality: "4K AUDIO",
    duration: "04:35",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAk4-42TWYkuKXC5FOf5ykYxamiTb-SfJy1rOGVzC9sT7xIHxxhr-lry_LSf40TEfK91ImJ6qKBaBCtdcQXQ9ZMK3oczB0wTZl6-IFvltpAN8aRK5mf0h4g-XLR25XfJ6zdU128APJiTDKe1yOX0tys7WkR2ptSvKulhd_aArxpAIF1if9s7UChQOxoj0EGfdsl6yc2fZCq9vPTv1juzNpG6EpH9VUrjHze_ZLESVYc5PBOXMnRb7gFga9l1PRlXZISRuBS_6_sht4",
  },
  {
    id: "02",
    title: "Leaving Caladan (Dune)",
    artist: "Hans Zimmer",
    genre: "ORCHESTRAL",
    quality: "DOLBY ATMOS",
    duration: "01:55",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAS0waotCoI0JN3sKI4-7q4npmIRSkSuUZVv4G342aNwRF4TtICdtHj-wsTdIah1qiqMO2aDeURiMkuZFfUeKlJQlGLqQ3uftf9g-WCGJ7s1B15g6iQgBA2MywQwxgOSUwVNmGxSPJ78nPKdBwGicEgY61ObIO0PrDnDugiBE97hA8YiiddfHakehDuX0xDm1ISLQP1acLctJNPHgXAuiYN8zBrTB1-hTH99acUwDTIhuwYhHmr_RDAGA8MtHU-gDoyjx4iD8g_Rok",
  },
];

export default function TracksSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
            Epic Masterpieces
        </h2>

        <p className="mt-2 text-muted-foreground">
            Curated cinematic tracks and unforgettable compositions.
        </p>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="group flex items-center justify-between rounded-3xl border border-transparent bg-card/40 p-6 transition-all hover:border-border hover:bg-accent/40"
          >
            <div className="flex items-center gap-6">
              <span className="w-8 text-sm text-muted-foreground">
                {track.id}
              </span>

              <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                <Image
                  src={track.image}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  {track.title}
                </h4>

                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  {track.artist}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-10 md:flex">
              <span className="text-xs tracking-widest text-muted-foreground">
                {track.genre}
              </span>

              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs tracking-widest text-foreground">
                {track.quality}
              </span>

              <span className="text-xs tracking-widest text-muted-foreground">
                {track.duration}
              </span>

              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
