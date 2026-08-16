import { NextResponse } from "next/server";
import { getSpotifySession, spotifyFetch, SpotifyApiError } from "@/lib/spotifyApi";

export const runtime = "nodejs";

// Lists the user's own playlists (owner-filtered server-side). Called lazily by
// PlaylistDropdown the first time it opens, rather than eagerly on every page load.
export async function GET(req) {
  const session = await getSpotifySession(req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await spotifyFetch(session.accessToken, "/me/playlists?limit=50");
    const ownPlaylists = (data.items || []).filter(
      (playlist) => playlist.owner?.id === session.spotifyId
    );
    return NextResponse.json({ playlists: ownPlaylists });
  } catch (error) {
    const status = error instanceof SpotifyApiError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || "Failed to load playlists" },
      { status }
    );
  }
}

// Creates a new playlist and, if a trackUri is provided, adds the track to it
// immediately server-side — "create a new playlist and add this song" in one round trip.
export async function POST(req) {
  const session = await getSpotifySession(req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, isPublic = false, trackUri } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
  }

  try {
    const playlist = await spotifyFetch(
      session.accessToken,
      `/users/${session.spotifyId}/playlists`,
      {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), public: isPublic }),
      }
    );

    if (trackUri) {
      await spotifyFetch(session.accessToken, `/playlists/${playlist.id}/tracks`, {
        method: "POST",
        body: JSON.stringify({ uris: [trackUri] }),
      });
    }

    return NextResponse.json({ playlist }, { status: 201 });
  } catch (error) {
    const status = error instanceof SpotifyApiError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || "Failed to create playlist" },
      { status }
    );
  }
}
