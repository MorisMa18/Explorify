"use client";

import { useEffect, useRef, useState } from "react";
import "./Song.css";

// Icons
import PlayCircleOutlineRoundedIcon from "@material-ui/icons/PlayCircleOutlineRounded";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import AirplayIcon from "@material-ui/icons/Airplay";

// Components
import AddToPlaylistButton from "./AddToPlaylistButton";
import PlaylistDropdown from "./PlaylistDropdown";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { selectNowPlayingTrackId, setNowPlayingTrack } from "@/store/songSlice";

function Song({ track }) {
  const dispatch = useDispatch();
  const nowPlayingTrackId = useSelector(selectNowPlayingTrackId);
  const isPlaying = nowPlayingTrackId === track.id;

  const audioRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [dropdownTopCoord, setDropdownTopCoord] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);

  // Locate where the playlist dropdown should appear, once, on mount.
  useEffect(() => {
    if (dropdownButtonRef.current) {
      setDropdownTopCoord(dropdownButtonRef.current.getBoundingClientRect().top);
    }
  }, []);

  // If another Song row starts playing, stop this one's preview.
  useEffect(() => {
    if (!isPlaying && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function getAudio() {
    if (!audioRef.current && track.preview_url) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.addEventListener("ended", () => {
        dispatch(setNowPlayingTrack(null));
      });
    }
    return audioRef.current;
  }

  function togglePreview() {
    const audio = getAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      dispatch(setNowPlayingTrack(null));
    } else {
      audio.currentTime = 0;
      audio.play();
      dispatch(setNowPlayingTrack(track.id));
    }
  }

  async function playInSpotify() {
    setPlaybackError(null);
    try {
      const response = await fetch("/api/spotify/playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackUri: track.uri }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Playback failed");
      }
    } catch (err) {
      setPlaybackError(err.message);
    }
  }

  const albumArt = track.album.images[1]?.url ?? track.album.images[0]?.url;

  return (
    <div className="songWrapper">
      <div className="song">
        <div className="song__left">
          <img src={albumArt} alt="Album Cover" heigh="100" width="100" />
          <div className="songInfo">
            <h3>{track.name}</h3>
            <p> {track.artists[0].name}</p>
          </div>
        </div>
        <div className="song__right">
          <div className="menuButton">
            {track.preview_url ? (
              isPlaying ? (
                <PauseCircleOutlineIcon onClick={togglePreview} />
              ) : (
                <PlayCircleOutlineRoundedIcon onClick={togglePreview} />
              )
            ) : (
              <PlayCircleOutlineRoundedIcon
                className="disabledIcon"
                titleAccess="Preview unavailable for this track"
              />
            )}
          </div>
          <div className="menuButton">
            <AirplayIcon onClick={playInSpotify} titleAccess="Play in Spotify" />
          </div>
          <div className="dropdownButton" ref={dropdownButtonRef}>
            <AddToPlaylistButton>
              <PlaylistDropdown topCoord={dropdownTopCoord} trackUri={track.uri}></PlaylistDropdown>
            </AddToPlaylistButton>
          </div>
        </div>
      </div>
      {playbackError && <p className="playbackError">{playbackError}</p>}
    </div>
  );
}

export default Song;
