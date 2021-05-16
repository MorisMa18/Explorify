import React from "react";
import "./Layout.css";

// Componenets
import Navbar from "./components/Navbar";
import CurrSong from "./components/CurrSong";
import RecommendedSongs from "./components/RecommendedSongs";
import RecommendedArtists from "./components/RecommendedArtists";

function Layout() {
  return (
    <div className="layout">
      {/* Navbar  */}
      <Navbar />

      {/* current song  */}
      <CurrSong />

      {/* recommended songs  */}
      <RecommendedSongs />

      {/* recommended artists  */}
      <RecommendedArtists />
    </div>
  );
}

export default Layout;
