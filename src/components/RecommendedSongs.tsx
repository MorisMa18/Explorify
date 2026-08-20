"use client";

import "./RecommendedSongs.css";

// Componenets
import Song from "./Song";

// Redux Stuff
import { useAppSelector } from "@/store/hooks";
import { selectSongRecommendations } from "@/store/songSlice";

function RecommendedSongs() {
  const songRecommendations = useAppSelector(selectSongRecommendations);

  return (
    <div className="recommendations">
      <h2> Songs You Might Like </h2>
      <div className="songs">
        {songRecommendations.length !== 0 ? (
          songRecommendations.map((track) => <Song key={track.id} track={track} />)
        ) : (
          <h1> uno pic here :) </h1>
        )}
      </div>
    </div>
  );
}

export default RecommendedSongs;
