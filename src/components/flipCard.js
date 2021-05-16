import React from "react";
import "../components/flipCard.css";
import { selectSong } from "../features/songSlice";
import { useSelector } from "react-redux";

function FlipCard() {
  const currSong = useSelector(selectSong);

  return (
    <div className="flip__card">
      <div className="flip__card__inner">
        <div className="flip__card__front">
          <img
            src={currSong.songPicture}
            alt="Album Cover"
            width="500"
            height="500"
          />
        </div>
        <div className="flip__card__back">
          <img
            src={currSong.songPicture}
            alt="Album Cover"
            width="500"
            height="500"
          />
          <h1> {currSong.songArtist} </h1>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
