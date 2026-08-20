import "./ArtistCard.css";
import emptyMixImage from "../images/emptymix.svg";
import type { SpotifyArtist } from "@/types/spotify";

interface ArtistCardProps {
  artist: SpotifyArtist;
}

function ArtistCard(props: ArtistCardProps) {
  const artistPhoto = props.artist.images?.[0]?.url || emptyMixImage;

  return (
    <div className="cardContainer">
      <div className="topContainer">
        <img className="artistPhoto" src={artistPhoto} alt="Artist Profile"></img>
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
