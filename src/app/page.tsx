"use client";

import Image from "next/image";
import {
  Play,
  Plus,
  ChevronRight,
  SkipBack,
  ChevronLeft,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  ListMusic,
  Mic2,
  MoreVertical,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


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

const heroSlides = [
  {
    title: "THE NEON ODYSSEY",
    description:
      "Experience the BAFTA-winning score by Aris Thorne. A haunting blend of analog synthesis and orchestral grandiosity that redefines cinematic tension and futuristic storytelling through sound.",
    composer: "Aris Thorne",
    genre: "Sci-Fi Ambient",
    audio: "Dolby Atmos",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrBb9tBgdaYh_gWp4fqJLgxJ-De-y2-qaRsvI0Gw6OJrHWNyu3xKY0tPPxWf8v-nklISTdYFsFzz21xfYrfqylbODsIKYHqVGsZtt4zA7rJug731yCmNS_APpgt4_0qlHKTQb4ra8rDh4ganS1wdOnwBtsQtRExNRDExwHXi7YOOTG4x0GY9WOqtJ5Jyx60oP_k61eoM2Md0L3qn5iIHNpYW3hApshCW2WiIjqGTzm18Ur356wU0dbBynav-g-hgP5lFSZoKyNb4k",
  },
  {
    title: "SHADOWS OF ELYSIUM",
    description:
      "An emotionally charged cinematic score layered with atmospheric strings, analog synth textures, and thunderous percussion.",
    composer: "Lena Volaris",
    genre: "Dark Orchestral",
    audio: "Spatial Audio",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiOME944kQk_JLg4nUWjS9Zmfi-WvKZGJULf_qGV_VjJ1dLeq2ktMPiBnr23R0XBNi2B55xoLNykx4RIrcknJjetkatRkBbkxEKqDXkLysyoapcWyXlckxE-Li_vw87FnxK-qa1AqfRpGq5j69Fhd5iT0GIpyrME6QmYcxEEbiYn07k-JSUairs5fHOn8IIxWCsvBZeidiKv17r05KEIoneksImjQ5ugNWNAK76Gmz4hzxzByOYCKg0CQonKr4__Hb3FJDmJToFdo",
  },
  {
    title: "CELESTIAL HORIZON",
    description:
      "A soaring futuristic soundtrack blending choir harmonies, cinematic brass, and immersive ambient soundscapes.",
    composer: "Kai Rutherford",
    genre: "Epic Cinematic",
    audio: "4K Audio",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgUtLJGKzHBr0msYdnVnMmhAUtpaYqMnao6u_fGqFCLZVUwvr3aBNF5hC1wGTly-LdTn00jlyhEFdIe8SDXiPUGiK0s4_bvTBEQThnMXn0oZZ-vGtl1g61RxqIuoWgZBrG_X4KIzUE-qBi67OOZrDeg6QYRVuXuJk0bYf0uUCaVKT8aPsjCrmgHJS9CDBiNPvXHNmWwj8N3alIZRE4VL45d-oGG2yWMEgS0Mlmk1qcRwb_pr_7zPTVVBuGukogsHNferK-mHJVfTo",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-12">
            <h1 className="text-3xl font-black tracking-tight text-primary">
              Cinematic
            </h1>
          </div>

          <div className="flex items-center gap-4">

            <Button variant="ghost">Sign In</Button>

            <Button className="rounded-full px-6">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border py-32">
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.12),transparent_55%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
          {/* LEFT SIDE IMAGE */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrBb9tBgdaYh_gWp4fqJLgxJ-De-y2-qaRsvI0Gw6OJrHWNyu3xKY0tPPxWf8v-nklISTdYFsFzz21xfYrfqylbODsIKYHqVGsZtt4zA7rJug731yCmNS_APpgt4_0qlHKTQb4ra8rDh4ganS1wdOnwBtsQtRExNRDExwHXi7YOOTG4x0GY9WOqtJ5Jyx60oP_k61eoM2Md0L3qn5iIHNpYW3hApshCW2WiIjqGTzm18Ur356wU0dbBynav-g-hgP5lFSZoKyNb4k"
                alt="The Neon Odyssey"
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-4">
              <span className="rounded-md bg-primary px-3 py-1 text-xs font-bold tracking-widest text-primary-foreground">
          ATMOS READY
              </span>

              <div className="flex items-center gap-2 text-xs tracking-widest text-primary">
                <Star className="h-4 w-4 fill-current" />
          FEATURED PRESENTATION
              </div>
            </div>

            <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl xl:text-8xl">
        THE NEON
              <br />
        ODYSSEY
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
        Experience the BAFTA-winning score by Aris Thorne.
        A haunting blend of analog synthesis and orchestral
        grandiosity that redefines cinematic tension and
        futuristic storytelling through sound.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button className="h-14 rounded-2xl px-8">
                <Play className="mr-2 h-5 w-5 fill-current" />
          Start Listening
              </Button>

              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border bg-accent/40 px-8 backdrop-blur-md hover:bg-accent"
              >
                <Plus className="mr-2 h-5 w-5" />
          Save To Library
              </Button>
            </div>

            {/* EXTRA INFO */}
            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground">
            COMPOSER
                </p>

                <p className="mt-2 font-semibold">
            Aris Thorne
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-muted-foreground">
            GENRE
                </p>

                <p className="mt-2 font-semibold">
            Sci-Fi Ambient
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-muted-foreground">
            AUDIO
                </p>

                <p className="mt-2 font-semibold">
            Dolby Atmos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold">
              Featured Soundtracks
            </h2>

            <p className="mt-2 text-muted-foreground">
              The most impactful scores of the season.
            </p>
          </div>

          <Button variant="ghost" className="text-primary">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredSoundtracks.map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="relative aspect-3/4 overflow-hidden rounded-3xl border border-border bg-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl">
                    <Play className="h-8 w-8 fill-current" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold tracking-widest text-primary">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURATED COLLECTIONS */}
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
          {/* LEFT LARGE CARD */}
          <div className="group relative overflow-hidden rounded-3xl border border-border lg:row-span-2">
            <div className="relative h-full min-h-[640px] w-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo7UEmhK9k3A1xv1fT1vK7w7fD7xQx8n8j2J2z4M5tN4Q3m0R1r2P3e6F9zXv4B2Q6x7p9K1d3L5n7F8H2j4T6m9W0c1V3"
                alt="Grandeur & Time"
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
          Grandeur & Time
              </h3>

              <p className="mt-4 max-w-md leading-7 text-muted-foreground">
          Monumental orchestral pieces and timeless cinematic
          compositions that shaped legendary storytelling.
              </p>

              <Button className="mt-6 rounded-full px-6">
                <Play className="mr-2 h-4 w-4 fill-current" />
          Listen To Collection
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
            {/* CARD 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-border">
              <div className="relative h-[310px] w-full">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz4K6x8M2j7T1p9W3n5Q6v8R1d4F7H0J2K9L5N8B3V6C1X4Z7A9S2D5F8G1H3J6K9L2M5N8P1Q4R7"
                  alt="Atmospheric Depth"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold">
            Atmospheric Depth
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ethereal textures, ambient tension, and immersive sonic
            landscapes.
                </p>

                <button className="mt-5 inline-flex items-center text-sm font-medium text-primary transition hover:opacity-80">
            Listen To Collection
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-border">
              <div className="relative h-77.5 w-full">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq8W2E5R7T9Y1U3I5O7P9A2S4D6F8G1H3J5K7L9Z2X4C6V8B1N3M5Q7W9E2R4"
                  alt="Fantasy Epics"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold">
            Fantasy Epics
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Heroic themes and mythical worlds brought to life through
            cinematic orchestration.
                </p>

                <button className="mt-5 inline-flex items-center text-sm font-medium text-primary transition hover:opacity-80">
            Listen To Collection
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-border lg:col-span-2">
              <div className="relative h-77.5 w-full">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk3N5M7B9V1C3X5Z7L9K2J4H6G8F1D3S5A7P9O2I4U6Y8T1R3E5W7Q9"
                  alt="Classic Scores"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-r from-background via-background/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-6 p-8 md:flex-row md:items-end">
                <div>
                  <h3 className="text-3xl font-black">
              Classic Scores
                  </h3>

                  <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Legendary soundtracks that defined generations of cinema
              and continue to inspire filmmakers worldwide.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="rounded-full border-border bg-background/60 backdrop-blur-md hover:bg-accent"
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
            Listen To Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
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

      {/* PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="flex h-24 items-center justify-between px-6">
          <div className="flex w-1/3 items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFeD7QHBj_E_w-PPS9PG1-s1EpGY7I7yx5LZVn7DauM4j76zuujyME-uLdnislaKL3WKZryFVOnDzCbaDLL_VpS-gzYcHi0ynWhvKkg8yGHclM9AyGapZQ-xny-JH5wR2FKKvIdGEk-C9Jn60eP7Mfi9p_MGtygWT1cWiJhoY-FiUqKqu232_TnVSSM5owNDpX4ZeSEpCf57f4IB2WsJyQUFHyc2Re3X8L8RzhL1ZPAVYtpIeN3O_BredLg05MOVYm5ydxBW6LZ74"
                alt="Now Playing"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-medium text-primary">
                The Neon Odyssey
              </p>

              <p className="text-xs text-muted-foreground">
                Aris Thorne
              </p>
            </div>
          </div>

          <div className="flex w-1/3 flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              <Shuffle className="h-4 w-4 text-muted-foreground" />
              <SkipBack className="h-5 w-5 text-muted-foreground" />

              <Button
                size="icon"
                className="rounded-full"
              >
                <Play className="h-5 w-5 fill-current" />
              </Button>

              <SkipForward className="h-5 w-5 text-muted-foreground" />
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="h-1 w-full max-w-md rounded-full bg-muted">
              <div className="h-1 w-1/3 rounded-full bg-primary" />
            </div>
          </div>

          <div className="flex w-1/3 items-center justify-end gap-5">
            <Mic2 className="h-5 w-5 text-muted-foreground" />

            <ListMusic className="h-5 w-5 text-muted-foreground" />

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />

              <div className="h-1 w-24 rounded-full bg-muted">
                <div className="h-1 w-2/3 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
