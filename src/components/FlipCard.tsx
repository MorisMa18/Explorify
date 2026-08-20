"use client";

import "./FlipCard.css";
import { selectSong } from "@/store/songSlice";
import { useAppSelector } from "@/store/hooks";

function FlipCard() {
  // FlipCard is only ever rendered by CurrSong inside a truthy `currSong` check.
  const currSong = useAppSelector(selectSong)!;

  return (
    <div className="flip__card">
      <div className="flip__card__inner">
        <div className="flip__card__front">
          <img
            src={currSong.songPicture ?? undefined}
            alt="Album Cover"
            width="500"
            height="500"
          />
        </div>
        <div className="flip__card__back">
          <img
            src={currSong.songPicture ?? undefined}
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
