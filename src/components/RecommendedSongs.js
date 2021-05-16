import React from "react";
import "../components/RecommendedSongs.css";

// Componenets
import Song from "./Song";

// Redux Stuff
import { useSelector } from "react-redux";
import { selectSongRecommendations } from "../features/songSlice";

function RecommendedSongs() {
  const songRecommendations = useSelector(selectSongRecommendations);

  return (
    <div className="recommendations">
      <h2> Songs You Might Like </h2>
      <div className="songs">
        {songRecommendations.length !== 0 ? (
          songRecommendations.tracks.map((track) => <Song track={track} />)
        ) : (
          <h1> uno pic here :) </h1>
        )}
      </div>
    </div>
  );
}

export default RecommendedSongs;
