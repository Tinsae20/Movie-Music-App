"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Home, Search, Library, Music2, Film, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home",        Icon: Home },
  { href: "/search",      label: "Search",     Icon: Search },
  { href: "/movies",      label: "Movies",     Icon: Film },
  { href: "/playlists",   label: "Playlists",  Icon: Music2 },
  { href: "/collections", label: "Collections",Icon: Layers },
  { href: "/library",     label: "Your Library",Icon: Library },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r flex flex-col bg-background">
      <div className="p-6">
        <span className="text-lg font-bold tracking-tight">🎵 Cinematic</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map(({ href, label, Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              path === href
                ? "bg-secondary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            )}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t flex items-center gap-3">
        <UserButton />
        <span className="text-sm text-muted-foreground">Account</span>
      </div>
    </aside>
  );
}

