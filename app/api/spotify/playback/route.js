import { NextResponse } from "next/server";
import { getAccessToken, spotifyFetch, SpotifyApiError } from "@/lib/spotifyApi";

export const runtime = "nodejs";

// Starts full-track playback on the user's active device (the "Airplay" button).
// Premium-only on Spotify's side — surfaced as a clear error rather than a silent failure.
export async function PUT(req) {
  const accessToken = await getAccessToken(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { trackUri } = await req.json();
  if (!trackUri) {
    return NextResponse.json({ error: "trackUri is required" }, { status: 400 });
  }

  try {
    await spotifyFetch(accessToken, "/me/player/play", {
      method: "PUT",
      body: JSON.stringify({ uris: [trackUri], position_ms: 0 }),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof SpotifyApiError ? error.status : 500;
    let message = error.message || "Playback failed";
    if (status === 403) {
      message = "Full playback requires Spotify Premium.";
    } else if (status === 404) {
      message = "No active Spotify device found — open Spotify on a device and try again.";
    }
    return NextResponse.json({ error: message }, { status });
  }
}
