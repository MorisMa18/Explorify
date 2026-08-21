import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CurrSong, DiscoverSuccess, SongAnalysis, SpotifyArtist, SpotifyTrack } from "@/types/spotify";

export interface SongState {
  currSong: CurrSong | null;
  songAnalysis: SongAnalysis;
  songRecommendations: SpotifyTrack[];
  artistRecommendations: SpotifyArtist[];
  noActivePlayback: boolean;
  nowPlayingTrackId: string | null;
}

const initialState: SongState = {
  currSong: null,
  // Catalog metadata standing in for Spotify's own audio-features analysis, which
  // was deprecated 2024-11-27 and is unavailable to this app (see discover/route.ts).
  songAnalysis: {
    popularity: 0,
    explicit: false,
    durationMs: 0,
    releaseDate: null,
    genres: [],
  },
  songRecommendations: [],
  artistRecommendations: [],
  noActivePlayback: false,
  // Shared "now playing" pointer so only one Song row's 30s preview plays at a time.
  nowPlayingTrackId: null,
};

export const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    updateDiscoverResults: (state, action: PayloadAction<DiscoverSuccess>) => {
      const { currSong, songAnalysis, songRecommendations, artistRecommendations } =
        action.payload;
      state.currSong = currSong;
      state.songAnalysis = songAnalysis;
      state.songRecommendations = songRecommendations;
      state.artistRecommendations = artistRecommendations;
      state.noActivePlayback = false;
    },
    setNoActivePlayback: (state) => {
      state.noActivePlayback = true;
      state.currSong = null;
    },
    setNowPlayingTrack: (state, action: PayloadAction<string | null>) => {
      state.nowPlayingTrackId = action.payload;
    },
    setCurrSong: (state, action: PayloadAction<CurrSong>) => {
      state.currSong = action.payload;
      state.noActivePlayback = false;
    },
  },
});

export const { updateDiscoverResults, setNoActivePlayback, setNowPlayingTrack, setCurrSong } =
  songSlice.actions;

export const selectSong = (state: { song: SongState }) => state.song.currSong;
export const selectSongAnalysis = (state: { song: SongState }) => state.song.songAnalysis;
export const selectSongRecommendations = (state: { song: SongState }) => state.song.songRecommendations;
export const selectArtistRecommendations = (state: { song: SongState }) => state.song.artistRecommendations;
export const selectNoActivePlayback = (state: { song: SongState }) => state.song.noActivePlayback;
export const selectNowPlayingTrackId = (state: { song: SongState }) => state.song.nowPlayingTrackId;

export default songSlice.reducer;
