"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongRow from "@/components/music/SongRow";
import MovieCard from "@/components/music/MovieCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const supabase = createClient();

  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim()) {return { songs: [], movies: [], playlists: [] };}
      const [s, m, p] = await Promise.all([
        supabase.from("songs").select("*, movie:movies(title)").ilike("title", `%${query}%`).limit(20),
        supabase.from("movies").select("*").ilike("title", `%${query}%`).limit(20),
        supabase.from("playlists").select("*").eq("is_public", true).ilike("name", `%${query}%`).limit(20),
      ]);
      return { songs: s.data ?? [], movies: m.data ?? [], playlists: p.data ?? [] };
    },
    enabled: query.length > 1,
  });

  return (
    <div className="p-6">
      <Input
        placeholder="Search songs, movies, playlists…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 max-w-lg text-lg h-12"
        autoFocus
      />

      {data && (
        <Tabs defaultValue="songs">
          <TabsList>
            <TabsTrigger value="songs">Songs ({data.songs.length})</TabsTrigger>
            <TabsTrigger value="movies">Movies ({data.movies.length})</TabsTrigger>
            <TabsTrigger value="playlists">Playlists ({data.playlists.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="songs" className="mt-4">
            {data.songs.map((s, i) => <SongRow key={s.id} song={s} index={i+1} queue={data.songs} />)}
          </TabsContent>
          <TabsContent value="movies" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.movies.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
