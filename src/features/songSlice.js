import { createSlice } from "@reduxjs/toolkit";

export const songSlice = createSlice({
  name: "song",
  initialState: {
    currSong: null,
    audioFeature: {
      songAcousticness: 0,
      songDanceability: 0,
      songEnergy: 0,
      songInstrumentalness: 0,
      songValence: 0,
      songSpeechiness: 0,
    },
    songRecommendations: [],
    artistRecommendations: [],
  },
  reducers: {
    updateCurrSong: (state, action) => {
      state.currSong = action.payload;
    },
    updateAudioFeature: (state, action) => {
      state.audioFeature = action.payload;
    },
    updateSongRecommendations: (state, action) => {
      state.songRecommendations = action.payload;
    },
    updateArtistRecommendations: (state, action) => {
      state.artistRecommendations = action.payload;
    },
  },
});

export const {
  updateCurrSong,
  updateAudioFeature,
  updateSongRecommendations,
  updateArtistRecommendations,
} = songSlice.actions;

export const selectSong = (state) => state.song.currSong;
export const selectSongFeature = (state) => state.song.audioFeature;
export const selectSongRecommendations = (state) =>
  state.song.songRecommendations;
export const selectArtistRecommendations = (state) =>
  state.song.artistRecommendations;

export default songSlice.reducer;
