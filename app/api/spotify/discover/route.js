import { NextResponse } from "next/server";
import { getAccessToken, spotifyFetch, SpotifyApiError } from "@/lib/spotifyApi";

export const runtime = "nodejs";

const MARKET = "US";

function dedupeById(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

// Spotify deprecated /recommendations, /related-artists, and /audio-features on
// 2024-11-27 for any app not already in Extended Quota Mode before that date — they
// 403 unconditionally for an app like this one, with no application path to get them
// back. This route rebuilds "similar songs/artists" from what's still available: the
// current artist's own top tracks, plus genre-filtered Search results, plus catalog
// metadata (popularity/genres/release date/duration) in place of Spotify's own
// audio-feature analysis.
export async function POST(req) {
  const accessToken = await getAccessToken(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const playback = await spotifyFetch(accessToken, "/me/player");
    if (!playback || !playback.item) {
      return NextResponse.json({ noActivePlayback: true });
    }

    const track = playback.item;
    const artistId = track.artists[0].id;

    const [artist, topTracksResponse] = await Promise.all([
      spotifyFetch(accessToken, `/artists/${artistId}`),
      spotifyFetch(accessToken, `/artists/${artistId}/top-tracks?market=${MARKET}`),
    ]);

    const topGenre = artist.genres?.[0];

    // Best-effort genre augmentation: if Search behaves unexpectedly for a given
    // genre string, fall back to just the artist's own top tracks rather than
    // failing the whole request.
    let genreTracks = [];
    let genreArtists = [];
    if (topGenre) {
      const genreQuery = encodeURIComponent(`genre:"${topGenre}"`);

      try {
        const genreTracksResponse = await spotifyFetch(
          accessToken,
          `/search?q=${genreQuery}&type=track&market=${MARKET}&limit=20`
        );
        genreTracks = genreTracksResponse?.tracks?.items ?? [];
      } catch {
        genreTracks = [];
      }

      try {
        const genreArtistsResponse = await spotifyFetch(
          accessToken,
          `/search?q=${genreQuery}&type=artist&market=${MARKET}&limit=20`
        );
        genreArtists = genreArtistsResponse?.artists?.items ?? [];
      } catch {
        genreArtists = [];
      }
    }

    const songRecommendations = dedupeById([...(topTracksResponse?.tracks ?? []), ...genreTracks])
      .filter((t) => t.id !== track.id)
      .slice(0, 20);

    const artistRecommendations = dedupeById(genreArtists)
      .filter((a) => a.id !== artistId)
      .slice(0, 9);

    return NextResponse.json({
      currSong: {
        songId: track.id,
        songUri: track.uri,
        songName: track.name,
        songArtist: track.artists[0].name,
        songArtistId: artistId,
        songPicture: track.album.images[0]?.url ?? null,
        songPopularity: track.popularity,
      },
      songAnalysis: {
        popularity: track.popularity,
        explicit: track.explicit,
        durationMs: track.duration_ms,
        releaseDate: track.album.release_date,
        genres: artist.genres ?? [],
      },
      songRecommendations,
      artistRecommendations,
    });
  } catch (error) {
    const status = error instanceof SpotifyApiError ? error.status : 500;
    const message =
      status === 429
        ? "Spotify is rate-limiting requests right now — try again in a moment."
        : error.message || "Discover failed";
    console.error("[/api/spotify/discover]", status, error.path, error.message, error.rawBody);
    return NextResponse.json({ error: message }, { status });
  }
}
