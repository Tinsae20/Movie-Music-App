"use client";

import { useEffect, useState } from "react";;
import Image from "next/image";
import { Play, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function HeroCarousel() {

  const [current, setCurrent] = useState(0);
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.12),transparent_55%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        {/* IMAGE */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="relative aspect-4/5 w-full overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          </div>
        </div>

        {/* CONTENT */}
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
            {slide.title}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            {slide.description}
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

          {/* META */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground">
                COMPOSER
              </p>

              <p className="mt-2 font-semibold">
                {slide.composer}
              </p>
            </div>

            <div>
              <p className="text-xs tracking-widest text-muted-foreground">
                GENRE
              </p>

              <p className="mt-2 font-semibold">
                {slide.genre}
              </p>
            </div>

            <div>
              <p className="text-xs tracking-widest text-muted-foreground">
                AUDIO
              </p>

              <p className="mt-2 font-semibold">
                {slide.audio}
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mt-10 flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* INDICATORS */}
            <div className="ml-4 flex items-center gap-2">
              {heroSlides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    current === index
                      ? "w-10 bg-primary"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}

