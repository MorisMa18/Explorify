import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currSong: null,
  // Catalog metadata standing in for Spotify's own audio-features analysis, which
  // was deprecated 2024-11-27 and is unavailable to this app (see discover/route.js).
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
    updateDiscoverResults: (state, action) => {
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
    setNowPlayingTrack: (state, action) => {
      state.nowPlayingTrackId = action.payload;
    },
  },
});

export const { updateDiscoverResults, setNoActivePlayback, setNowPlayingTrack } =
  songSlice.actions;

export const selectSong = (state) => state.song.currSong;
export const selectSongAnalysis = (state) => state.song.songAnalysis;
export const selectSongRecommendations = (state) => state.song.songRecommendations;
export const selectArtistRecommendations = (state) => state.song.artistRecommendations;
export const selectNoActivePlayback = (state) => state.song.noActivePlayback;
export const selectNowPlayingTrackId = (state) => state.song.nowPlayingTrackId;

export default songSlice.reducer;
