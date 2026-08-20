"use client";

import "./Login.css";
import { signIn } from "next-auth/react";

function Login() {
  return (
    <div className="login">
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt=""
      />
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          signIn("spotify");
        }}
      >
        Login to Spotify
      </a>
    </div>
  );
}

export default Login;
