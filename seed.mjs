/**
 * Seed script for the Movie Music App
 * ------------------------------------
 * Data sources:
 *   - TMDB API   → movie metadata (title, description, poster, year, genre)
 *   - Deezer API → song search per movie, returns 30s preview audio_url + cover art
 *
 * Why this combo:
 *   - TMDB requires a free API key but has zero per-request cost and clean movie metadata.
 *   - Deezer requires NO auth for catalog search, and uniquely returns a real,
 *     playable `preview` MP3 URL per track — which is exactly what `songs.audio_url` needs.
 *     (Spotify's Web API can return preview URLs too, but requires an OAuth client-credentials
 *     flow; Deezer skips that entirely for search/track lookups.)
 *
 * Run:
 *   TMDB_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node seed.mjs
 *
 * Requires: npm install @supabase/supabase-js node-fetch (or Node 18+, which has global fetch)
 */

import { createClient } from "@supabase/supabase-js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!TMDB_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing required env vars. Set TMDB_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Curate the movie list yourself — TMDB's "popular" endpoint works too,
// but an explicit list gives you control over which soundtracks actually
// have good Deezer search results (avoids obscure titles with zero matches).
const MOVIE_TITLES = [
  "Guardians of the Galaxy",
  "La La Land",
  "Interstellar",
  "The Greatest Showman",
  "Black Panther",
  "Frozen",
  "Top Gun: Maverick",
  "Barbie",
  "Inside Out",
  "Encanto",
];

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780";

async function fetchTmdbMovie(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    title
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB search failed for "${title}": ${res.status}`);
  const data = await res.json();
  const match = data.results?.[0];
  if (!match) {
    console.warn(`  ⚠ No TMDB result for "${title}", skipping.`);
    return null;
  }

  // Fetch genre names — TMDB's search endpoint only returns genre_ids,
  // so we need the configured genre list to map id -> name.
  const genreRes = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
  );
  const genreData = await genreRes.json();
  const genreMap = new Map(genreData.genres.map((g) => [g.id, g.name]));
  const genre = match.genre_ids?.map((id) => genreMap.get(id)).filter(Boolean)[0] ?? null;

  return {
    title: match.title,
    description: match.overview,
    cover_url: match.poster_path ? `${TMDB_IMAGE_BASE}${match.poster_path}` : null,
    release_year: match.release_date ? Number(match.release_date.slice(0, 4)) : null,
    genre,
  };
}

async function fetchDeezerSongs(movieTitle, maxSongs = 8) {
  // Searching "<title> soundtrack" surfaces official soundtrack album tracks
  // more reliably than searching the bare title, which mostly returns
  // unrelated songs that merely mention the movie name.
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(
    `${movieTitle} soundtrack`
  )}&limit=${maxSongs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Deezer search failed for "${movieTitle}": ${res.status}`);
  const data = await res.json();

  return (data.data ?? [])
    .filter((track) => track.preview) // only keep tracks that actually have a playable preview
    .map((track) => ({
      title: track.title,
      artist: track.artist?.name ?? "Unknown Artist",
      duration_secs: track.duration ?? 30,
      audio_url: track.preview, // 30-second MP3 preview, no auth required to play
      cover_url: track.album?.cover_big ?? track.album?.cover_medium ?? null,
    }));
}

async function seed() {
  for (const title of MOVIE_TITLES) {
    console.log(`\nProcessing "${title}"...`);

    const movieData = await fetchTmdbMovie(title);
    if (!movieData) continue;

    // Insert movie — the `after_movie_insert` trigger from the schema
    // automatically creates its soundtrack playlist row.
    const { data: movie, error: movieError } = await supabase
      .from("movies")
      .upsert(movieData, { onConflict: "title" })
      .select()
      .single();

    if (movieError) {
      console.error(`  ✗ Failed to insert movie "${title}":`, movieError.message);
      continue;
    }
    console.log(`  ✓ Movie inserted: ${movie.title} (${movie.release_year})`);

    const songs = await fetchDeezerSongs(title);
    if (songs.length === 0) {
      console.warn(`  ⚠ No Deezer tracks with previews found for "${title}".`);
      continue;
    }

    // Insert songs — the `after_song_insert` trigger automatically adds
    // each one to the movie's auto-generated soundtrack playlist.
    const { error: songsError } = await supabase
      .from("songs")
      .insert(songs.map((s) => ({ ...s, movie_id: movie.id })));

    if (songsError) {
      console.error(`  ✗ Failed to insert songs for "${title}":`, songsError.message);
      continue;
    }
    console.log(`  ✓ ${songs.length} songs inserted`);

    // Be polite to both free APIs — small delay between movies
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nSeeding complete.");
}

seed().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
