// Spotify Web API object types, sized to what this app actually reads/passes
// through. See https://developer.spotify.com/documentation/web-api/reference
// for the full reference; the app's routes deliberately avoid /recommendations,
// /related-artists and /audio-features (deprecated 2024-11-27) — see the
// comment at the top of app/api/spotify/discover/route.ts.

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifyPagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

// Artist Object (full) — GET /artists/{id}, search (type=artist)
export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  followers?: SpotifyFollowers;
  genres: string[];
  href: string;
  id: string;
  images?: SpotifyImage[];
  name: string;
  popularity?: number;
  type: "artist";
  uri: string;
}

// Simplified Artist Object — as embedded in Track/Album objects
export interface SpotifySimplifiedArtist {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

// Simplified Album Object — as embedded in Track objects
export interface SpotifySimplifiedAlbum {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  type: "album";
  uri: string;
  artists: SpotifySimplifiedArtist[];
}

// Track Object (full) — GET /me/player, top-tracks, search (type=track)
export interface SpotifyTrack {
  album: SpotifySimplifiedAlbum;
  artists: SpotifySimplifiedArtist[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_local?: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
}

// GET /me/player
export interface SpotifyCurrentlyPlaying {
  device?: {
    id: string | null;
    is_active: boolean;
    name: string;
    type: string;
    volume_percent: number | null;
  };
  progress_ms: number | null;
  is_playing: boolean;
  item: SpotifyTrack | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
}

// Simplified User Object — as embedded in Playlist objects
export interface SpotifyPlaylistOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: "user";
  uri: string;
  display_name?: string | null;
}

// Simplified Playlist Object — GET /me/playlists items, POST .../playlists response
export interface SpotifySimplifiedPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyPlaylistOwner;
  public: boolean | null;
  snapshot_id: string;
  tracks: { href: string; total: number };
  type: "playlist";
  uri: string;
}

// GET /artists/{id}/top-tracks
export interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

// GET /search?type=track
export interface SpotifySearchTracksResponse {
  tracks: SpotifyPagingObject<SpotifyTrack>;
}

// GET /search?type=artist
export interface SpotifySearchArtistsResponse {
  artists: SpotifyPagingObject<SpotifyArtist>;
}

// ---- Bespoke app-level DTOs (NOT raw Spotify shapes) ----

// The Redux "current song" summary built server-side by the discover route —
// distinct from a raw SpotifyTrack.
export interface CurrSong {
  songId: string;
  songUri: string;
  songName: string;
  songArtist: string;
  songArtistId: string;
  songPicture: string | null;
  songPopularity: number;
}

export interface SongAnalysis {
  popularity: number;
  explicit: boolean;
  durationMs: number;
  releaseDate: string | null;
  genres: string[];
}

// POST /api/spotify/discover response shapes
export interface DiscoverNoActivePlayback {
  noActivePlayback: true;
}

export interface DiscoverSuccess {
  currSong: CurrSong;
  songAnalysis: SongAnalysis;
  songRecommendations: SpotifyTrack[];
  artistRecommendations: SpotifyArtist[];
}

export interface DiscoverError {
  error: string;
}

export type DiscoverResponse = DiscoverNoActivePlayback | DiscoverSuccess | DiscoverError;
