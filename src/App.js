import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import './App.css';

// User Reducer
import { selectUser } from './features/userSlice'
import { login, logout, updateUserPlaylists } from './features/userSlice'

import SpotifyWebApi from 'spotify-web-api-js';

// Components
import Layout from './Layout';

// Login Page
import Login from './login/Login';
import { getTokenFromResponse } from './services/spotifyAuth';

// Create instance of Spotify API
const spotify = new SpotifyWebApi(); 

function App() {
  // Local state using useState() hook in function componenet
  const [token, setToken] = useState(null);

  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  useEffect(() => {
    const hash = getTokenFromResponse(); 
    window.location.hash = ''; // clear access token in URL for security reason
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      let userId;

      // TODO: Make so doesn't have to login each time refresh 
      // (1. Firebase ?)
      spotify.setAccessToken(_token);

      spotify.getMe()
        .then(user => {
          userId = user.id;
          console.log(user.id);
          dispatch(
            login({
              displayName: user.display_name,
              id: user.id,
              profileImage: user.images[0].url
            })
          )
        });
      
      let i;
      spotify.getUserPlaylists()
        .then(playlists => {
          console.log(playlists);
          for (i = 0; i < playlists.items.length; i ++) {
            if (playlists.items[i].owner.id === userId) {
              console.log(playlists.items[i]);
              dispatch(
                updateUserPlaylists(playlists.items[i])
              )
            }
          }
        })
    }
  }, [dispatch]);

  return (
    <div className="App">
      {user ? (
        <Layout />
      ) : (
        <Login />
      )
      }
    </div>
  );
}

export default App;
