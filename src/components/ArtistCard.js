import React from "react";
import "./ArtistCard.css";

function ArtistCard(props) {
  return (
    <div className="cardContainer">
      <div className="topContainer">
        {console.log(props)}
        {/* TODO: Some artists don't have profile pic */}
        <img
          className="artistPhoto"
          src={props.artist.images[0].url}
          alt="Artist Profile"
        ></img>
      </div>
      <div className="bottomContainer">
        <h2 className="artistName">{props.artist.name}</h2>
        <p className="genreName">
          {props.artist.genres.length !== 0 ? props.artist.genres[0] : ""}
        </p>
      </div>
    </div>
  );
}

export default ArtistCard;
