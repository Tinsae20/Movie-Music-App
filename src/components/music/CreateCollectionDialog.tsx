"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient, createAuthClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, X, ListMusic, Check, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import type { Playlist, Song } from "@/lib/types";

interface DBPlaylistSong {
  song: Song | null;
}

interface DBPlaylist {
  id: string;
  user_id: string | null;
  movie_id: string | null;
  name: string;
  type: "movie" | "favorites" | "custom";
  is_public: boolean;
  playlist_songs?: DBPlaylistSong[];
}

const SUGGESTED_COVERS = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80", // Movie theater
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", // Microphone/Sound
  "https://images.unsplash.com/photo-1539625319175-92857816ce80?w=800&q=80", // Vinyl records
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", // Retro cassettes
  "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80", // Musical notes
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80", // Cinematic bokeh
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", // Headphones
];

const PRESET_THEMES = [
  { value: "animation", label: "Animated" },
  { value: "sci-fi", label: "Sci-Fi & Fantasy" },
  { value: "action", label: "Action & Adventure" },
  { value: "drama", label: "Drama" },
  { value: "romance", label: "Romance" },
  { value: "thriller", label: "Thriller & Horror" },
];

export default function CreateCollectionDialog() {
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [theme, setTheme] = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  // Fetch all playlists using React Query
  const { data: playlists = [], isLoading: isLoadingPlaylists } = useQuery<Playlist[]>({
    queryKey: ["playlists", "all-for-selection"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" });
      const client = token ? createAuthClient(token) : createClient();

      const { data, error } = await client
        .from("playlists")
        .select("*, playlist_songs(song:songs(*))")
        .order("name");

      if (error) {
        throw error;
      }

      const dbPlaylists = (data as unknown) as DBPlaylist[];

      return (
        (dbPlaylists ?? []).map((playlist) => ({
          ...playlist,
          songs: playlist.playlist_songs?.map((r) => r.song).filter((s): s is Song => !!s) ?? [],
        })) ?? []
      );
    },
    enabled: isOpen,
  });

  const handleOpen = () => {
    // Reset state
    setTitle("");
    setDescription("");
    setCoverUrl("");
    setTheme("");
    setCustomTheme("");
    setSelectedPlaylists([]);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) {return;}
    setIsOpen(false);
  };

  const togglePlaylistSelection = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const selectRandomCover = () => {
    const randomIndex = Math.floor(Math.random() * SUGGESTED_COVERS.length);
    setCoverUrl(SUGGESTED_COVERS[randomIndex]);
    toast.info("Suggested a background cover artwork!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a collection title");
      return;
    }

    if (selectedPlaylists.length === 0) {
      toast.error("Please select at least one playlist for this collection");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating collection...");

    try {
      const token = await getToken({ template: "supabase" });
      const client = token ? createAuthClient(token) : createClient();

      const finalTheme = theme === "custom" ? customTheme : theme;

      // 1. Create the Collection
      const { data: newCollection, error: colError } = await client
        .from("collections")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          cover_url: coverUrl.trim() || null,
          theme: finalTheme.trim() || null,
        })
        .select()
        .single();

      if (colError) {throw colError;}

      // 2. Insert the Junction Rows
      const junctionRows = selectedPlaylists.map((playlistId, index) => ({
        collection_id: newCollection.id,
        playlist_id: playlistId,
        position: index + 1,
      }));

      const { error: junctionError } = await client
        .from("collection_playlists")
        .insert(junctionRows);

      if (junctionError) {throw junctionError;}

      toast.success("Collection created successfully!", { id: toastId });
      setIsOpen(false);

      // Invalidate queries & Refresh Page Data
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      router.refresh();
    } catch (err) {
      console.error("Error creating collection:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create collection";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <Plus size={16} />
        Create Collection
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with smooth blur */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
            onClick={handleClose}
          />

          {/* Modal Card */}
          <div className="relative bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Create Curated Collection</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Group movie soundtracks or custom playlists into a theme
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="col-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Collection Title *
                  </label>
                  <input
                    id="col-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 90s Blockbusters, Epic Orchestras"
                    className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="col-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    id="col-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summarize the theme, style, or feeling of this collection..."
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                  />
                </div>

                {/* Cover URL with preset suggestions */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="col-cover" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon size={12} />
                      Cover Image URL
                    </label>
                    <button
                      type="button"
                      onClick={selectRandomCover}
                      className="text-xs text-primary hover:opacity-80 font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Sparkles size={12} />
                      Random Artwork
                    </button>
                  </div>
                  <input
                    id="col-cover"
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                  {coverUrl && (
                    <div className="mt-2 relative w-32 aspect-2/1 rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverUrl} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>

                {/* Theme & Custom Theme Selector */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="col-theme" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Theme Preset
                    </label>
                    <select
                      id="col-theme"
                      value={theme}
                      onChange={(e) => {
                        setTheme(e.target.value);
                        if (e.target.value !== "custom") {setCustomTheme("");}
                      }}
                      className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    >
                      <option value="">No Theme</option>
                      {PRESET_THEMES.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                      <option value="custom">Custom Theme...</option>
                    </select>
                  </div>

                  {theme === "custom" && (
                    <div className="space-y-1.5 animate-in slide-in-from-left duration-200">
                      <label htmlFor="col-custom-theme" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Custom Theme Name
                      </label>
                      <input
                        id="col-custom-theme"
                        type="text"
                        required
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        placeholder="e.g. sci-fi, cyberpunk"
                        className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Playlist Selection Checklist */}
                <div className="space-y-2 border-t pt-4 border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Select Playlists to Include *
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedPlaylists.length} selected
                    </span>
                  </div>

                  <div className="border border-border/80 rounded-xl bg-background/30 overflow-hidden">
                    {isLoadingPlaylists ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <Loader2 className="animate-spin text-muted-foreground" size={20} />
                        <span className="text-xs text-muted-foreground">Loading available playlists...</span>
                      </div>
                    ) : playlists.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No playlists found. Create some playlists first!
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto divide-y divide-border/40">
                        {playlists.map((playlist) => {
                          const isChecked = selectedPlaylists.includes(playlist.id);
                          return (
                            <button
                              type="button"
                              key={playlist.id}
                              onClick={() => togglePlaylistSelection(playlist.id)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/40 transition-colors text-left ${
                                isChecked ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-all ${
                                  isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/50"
                                }`}>
                                  {isChecked && <Check size={10} strokeWidth={3} />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{playlist.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {playlist.songs?.length ?? 0} {playlist.songs?.length === 1 ? "song" : "songs"}
                                    {playlist.type === "movie" ? " · Soundtrack" : " · Custom"}
                                  </p>
                                </div>
                              </div>
                              <ListMusic size={14} className="text-muted-foreground" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || selectedPlaylists.length === 0}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-primary/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Collection"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
