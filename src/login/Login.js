import React from 'react';
import '../login/Login.css';
import { loginURL } from '../services/spotifyAuth';

function Login() {
  return (
    <div className="login">
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt=""
      />
      <a href={loginURL}>Login to Spotify</a>
    </div>
  );
}

export default Login;