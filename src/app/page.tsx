import Image from "next/image";
import {
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  ListMusic,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroCarousel from "@/components/home/hero-carousel";
import FeaturedSoundtracks from "@/components/home/featured-tracks";
import CuratedCollections from "@/components/home/collections";
import TracksSection from "@/components/home/tracks";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/discover");
  }

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

            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/discover">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/discover">
                <Button className="rounded-full px-6">Sign Up</Button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>

            {/* <Button variant="ghost">Sign In</Button>

            <Button className="rounded-full px-6">
              Sign Up
            </Button> */}
          </div>
        </div>
      </nav>
      {/* HERO */}
      <HeroCarousel />

      {/* FEATURED */}
      <FeaturedSoundtracks />

      {/* CURATED COLLECTIONS */}
      <CuratedCollections />

      {/* TRACKS */}
      <TracksSection />

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
