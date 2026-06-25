export interface User {
  id: string;
  clerk_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  release_year: number | null;
  genre: string | null;
}

export interface Song {
  id: string;
  movie_id: string;
  title: string;
  artist: string;
  duration_secs: number;
  audio_url: string;
  cover_url: string | null;
  movie?: Movie;
}

export interface Playlist {
  id: string;
  user_id: string | null;
  movie_id: string | null;
  name: string;
  type: "movie" | "favorites" | "custom";
  is_public: boolean;
  songs?: Song[];
}

export interface Collection {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  theme: string | null;
  playlists?: Playlist[];
}
