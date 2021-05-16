import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // 3 Attributes
      // 1. displayName
      // 2. id
      // 3. profileImage
    user: null,
    playlists: [],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null; 
    },
    updateUserPlaylists: (state, action) => {
      state.playlists = [...state.playlists, action.payload]
    }
  },
});

export const { login, logout, updateUserPlaylists } = userSlice.actions;

export const selectUser = state => state.user.user;
export const selectUserPlaylists = state => state.user.playlists;


export default userSlice.reducer;
