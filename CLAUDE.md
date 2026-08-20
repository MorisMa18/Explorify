# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Explorify is a Next.js + TypeScript web app that gives Spotify users endless music and artist recommendations based on the song they're currently listening to, helping them explore music outside their usual taste profile. It was migrated from a client-only Create React App to Next.js specifically to fix an insecure implicit-grant OAuth flow (token only in React state, lost on every refresh) and to move all Spotify API access server-side; it was later converted from JavaScript to TypeScript for compile-time safety around the Spotify Web API response shapes.

## Commands

- `npm install` — install dependencies (also regenerates `package-lock.json`, which was reset by the CRA→Next.js migration); on this project's React 18 + Material-UI v4 combination, npm's peer-dependency resolution needs `--legacy-peer-deps`
- `npm run dev` — dev server (http://127.0.0.1:3000 — Spotify requires `127.0.0.1`, not `localhost`, for local redirect URIs)
- `npm run build` — production build (also runs Next's TypeScript + ESLint checks)
- `npm start` — run a production build
- `npm run lint` — `next lint` (`next/core-web-vitals`)
- `npx tsc --noEmit` — type-check only, faster feedback loop than a full build

Requires `.env.local` (see `.env.local.example`): `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. No test suite exists.

## Architecture

**Auth (the core fix):** `src/lib/auth.ts` configures next-auth (Auth.js v4) with the Spotify provider and `session: { strategy: "jwt" }` — no database. The `jwt` callback stores `accessToken`/`refreshToken`/`accessTokenExpires` on sign-in and silently refreshes the access token server-side (via Spotify's `/api/token` refresh grant) whenever it's expired, before any Spotify call uses it — this is what lets a session survive a page refresh instead of forcing re-login every time. **Security boundary:** the `session` callback deliberately never copies `accessToken`/`refreshToken` onto the `session` object — only `session.user.id`/`name`/`image` and an `error` flag are exposed, since anything in `session` is servable to the browser via `useSession()` / `GET /api/auth/session`. Route handlers instead call `getAccessToken(req)` / `getSpotifySession(req)` from `src/lib/spotifyApi.ts`, which use `getToken()` from `next-auth/jwt` to decrypt the httpOnly session cookie directly, server-side only — the raw Spotify token never reaches client JS. The `Session`/`JWT` field shapes above are declared via module augmentation in `src/types/next-auth.d.ts`, not inline in `auth.ts`.

**Spotify API access:** the browser never talks to `api.spotify.com` directly (except for unauthenticated `preview_url` MP3s, which need no token). Every other Spotify call is proxied through a Next.js Route Handler in `app/api/spotify/`, using `spotifyFetch<T>()` from `src/lib/spotifyApi.ts` (generic — each call site passes the Spotify response type it expects, from `src/types/spotify.ts`):
- `app/api/spotify/discover/route.ts` (`POST`) — fetches currently-playing (`/me/player`), then the current artist (`/artists/{id}` for genres) and their top tracks (`/artists/{id}/top-tracks`) in parallel, then best-effort genre-filtered Search calls (`/search?q=genre:"..."`) for additional song/artist recommendations. Returns `{ noActivePlayback: true }` if nothing is playing. **Deliberately does not call `/recommendations`, `/related-artists`, or `/audio-features`** — Spotify deprecated all three on 2024-11-27 for any app not already in Extended Quota Mode before that date, and there is no application path to get them back (see the comment at the top of this file for sources). `songAnalysis` in the response is built from still-available catalog metadata (popularity, genres, release date, duration, explicit flag), not Spotify's own audio-feature ML output. Its response shapes (`DiscoverSuccess`/`DiscoverNoActivePlayback`/`DiscoverError`, unioned as `DiscoverResponse`) live in `src/types/spotify.ts` and are reused as the Redux `updateDiscoverResults` payload type.
- `app/api/spotify/playback/route.ts` (`PUT`) — starts full playback on the user's active device (Premium-only; 403s are translated into a friendly error).
- `app/api/spotify/playlists/route.ts` (`GET`/`POST`) — lists the user's own playlists (owner-filtered), or creates a new playlist and optionally adds a track to it in the same request.
- `app/api/spotify/playlists/[playlistId]/tracks/route.ts` (`POST`) — adds a track to an existing playlist.

All routes run on the Node.js runtime (`export const runtime = "nodejs"`) since next-auth's JWT crypto needs Node APIs.

**If you're touching `discover/route.ts`:** don't reach for `/recommendations`, `/related-artists`, or `/audio-features` — they will 403 for this app regardless of scopes or auth state. `Song.tsx`/`ArtistCard.tsx` still consume standard Spotify Track/Artist objects either way (Search and Top Tracks return the same object shapes recommendations/related-artists used to), so no component changes are needed if this route's data sourcing changes again.

**Root shell:** `app/layout.tsx` (global styles + providers) → `app/providers.tsx` (client component: `SessionProvider` + Redux `Provider`) → `app/page.tsx` (server component; `getServerSession(authOptions)` decides whether to render `Login` or `Layout`).

**Component tree:** `Layout` → `Navbar`, `CurrSong`, `RecommendedSongs`, `RecommendedArtists`, all under `src/components/` as `.tsx` files, each still paired with a co-located global (non-module) CSS file — Next's App Router allows importing plain CSS from any component regardless of file extension, so this didn't need to change during the TypeScript conversion either. `CurrSong`'s "DISCOVER NEW SONGS!" button calls `/api/spotify/discover` once and dispatches the combined result. `Song` owns a 30-second `preview_url` snippet player; only one can play at a time, coordinated via `nowPlayingTrackId` in `songSlice` (each `Song` instance pauses itself in a `useEffect` when Redux says a different track became active) rather than each row managing independent, uncoordinated audio state. `PlaylistDropdown` lazy-fetches the user's playlists the first time it's opened (not eagerly on page load) and has three `CSSTransition` panes: main menu, existing-playlist list, and create-new-playlist.

**State management:** Redux Toolkit, `src/store/store.ts` (exports `RootState`/`AppDispatch`), one slice (`src/store/songSlice.ts`) for currently-playing/songAnalysis/recommendations/now-playing-track. Components use the typed `useAppDispatch`/`useAppSelector` hooks from `src/store/hooks.ts` rather than raw `react-redux` hooks, so selector/dispatch calls are inferred instead of implicit-`any`. There is no user/auth slice — identity comes from next-auth's `useSession()` directly (see `Navbar.tsx`), to avoid a second, driftable source of truth for something the session cookie already owns.

**Styling:** unchanged from the original design intentionally — a mix of Bootstrap (`react-bootstrap`), Material-UI v4 (`@material-ui/core`/`icons`), `react-owl-carousel` (dynamically imported with `ssr: false` in `RecommendedArtists.tsx` since it touches `window` at import time), and per-component CSS files. No design system, no `@media` queries — responsiveness comes entirely from Bootstrap/MUI defaults.

**TypeScript:** `strict: true`, `allowJs: false` — the whole app is TS/TSX, no mixed JS. `src/types/spotify.ts` holds real (importable) interfaces for the Spotify Web API objects this app actually uses (Track, Artist, Album, Playlist, paging, etc.) plus the app's own bespoke DTOs (`CurrSong`, `SongAnalysis`, `DiscoverResponse`) — the latter are deliberately distinct types from the raw Spotify shapes since the discover route reshapes data before sending it to the client. `src/types/` also holds ambient declarations: `next-auth.d.ts` (Session/JWT module augmentation), `global.d.ts` (`window.jQuery`/`window.$` for the owl-carousel dynamic-import shim), `react-owl-carousel.d.ts` (a `jquery/dist/jquery.js` subpath shim — `react-owl-carousel` itself ships its own types), and `svg.d.ts` (`*.svg` imports as `string`). `src/lib/errors.ts` exports `getErrorMessage(error: unknown)`, used everywhere a `catch` block needs `.message` off an unknown error.

**Scaling note:** stateless JWT sessions + no DB scale horizontally on Vercel by construction. The actual ceiling at scale is Spotify's own platform, not the app: apps default to a 25-user cap ("Development Mode") until submitted for Extended Quota Mode in the Spotify Developer Dashboard.
