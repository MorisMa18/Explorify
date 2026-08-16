import { NextResponse } from "next/server";
import { getAccessToken, spotifyFetch, SpotifyApiError } from "@/lib/spotifyApi";

export const runtime = "nodejs";

// Adds a track to an existing playlist the user owns.
export async function POST(req, { params }) {
  const accessToken = await getAccessToken(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { trackUri } = await req.json();
  if (!trackUri) {
    return NextResponse.json({ error: "trackUri is required" }, { status: 400 });
  }

  try {
    await spotifyFetch(accessToken, `/playlists/${params.playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: [trackUri] }),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof SpotifyApiError ? error.status : 500;
    return NextResponse.json({ error: error.message || "Failed to add track" }, { status });
  }
}
