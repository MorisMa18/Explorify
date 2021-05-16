import React, { useEffect, useState } from "react";
import "../components/Song.css";

// Spotify API
import SpotifyWebApi from "spotify-web-api-js";

// Icons
import PlayCircleOutlineRoundedIcon from "@material-ui/icons/PlayCircleOutlineRounded";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import AirplayIcon from "@material-ui/icons/Airplay";

// Components
import AddToPlaylistButton from "./AddToPlaylistButton";
import PlaylistDropdown from "./PlaylistDropdown";

// Create instance of Spotify API
const spotify = new SpotifyWebApi();

function Song(track) {
  let dropdownTopCoord;
  useEffect(() => {
    dropdownTopCoord = document
      .querySelector(".dropdownButton")
      .getBoundingClientRect().top;
  });
  // Request headers to play a track in spotify
  const requestHeader = {
    uris: [track.track.uri],
    position_ms: 0,
  };
  const audio = new Audio(track.track.preview_url);
  const [playing, setPlaying] = useState(false);
  const [currPlaying, setCurrPlaying] = useState();

  const playAudio = () => {
    audio.play();
    setCurrPlaying(audio);

    // Automatically change pause -> play when audio ends
    const timer = setInterval(function () {
      if (audio.currentTime > 30) {
        clearInterval(timer);
        setPlaying(false);
      }
    }, 1000);
  };

  const pauseAudio = () => {
    console.log("paused");
    currPlaying.pause();
  };

  function playInSpotify() {
    spotify.play(requestHeader);
  }

  // Locate where the dropdown should appear

  return (
    <div className="song">
      <div className="song__left">
        <img
          src={track.track.album.images[1].url}
          alt="Album Cover"
          heigh="100"
          width="100"
        />
        <div className="songInfo">
          <h3>{track.track.name}</h3>
          <p> {track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="song__right">
        <div className="menuButton">
          {playing ? (
            <PauseCircleOutlineIcon
              onClick={() => {
                pauseAudio();
                setPlaying(!playing);
              }}
            />
          ) : (
            <PlayCircleOutlineRoundedIcon
              onClick={() => {
                playAudio();
                setPlaying(!playing);
              }}
            />
          )}
        </div>
        <div className="menuButton">
          <AirplayIcon onClick={playInSpotify} />
        </div>
        <div className="dropdownButton">
          <AddToPlaylistButton>
            <PlaylistDropdown
              topCoord={dropdownTopCoord}
              trackUri={track.track.uri}
            ></PlaylistDropdown>
          </AddToPlaylistButton>
        </div>
      </div>
    </div>
  );
}

export default Song;
