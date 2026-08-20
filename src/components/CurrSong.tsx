"use client";

import { useState } from "react";
import "./CurrSong.css";
import emptyMixImage from "../images/emptymix.svg";

// Song Reducer
import {
  selectSong,
  selectSongAnalysis,
  selectNoActivePlayback,
  updateDiscoverResults,
  setNoActivePlayback,
} from "@/store/songSlice";

// UI Components
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FlipCard from "./FlipCard";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { getErrorMessage } from "@/lib/errors";
import type { DiscoverResponse } from "@/types/spotify";

function formatDuration(durationMs: number) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function CurrSong() {
  // Styling
  const linearBarStyle = { marginBottom: 40 };

  // Redux Stuff
  const dispatch = useAppDispatch();
  const currSong = useAppSelector(selectSong);
  const songAnalysis = useAppSelector(selectSongAnalysis);
  const noActivePlayback = useAppSelector(selectNoActivePlayback);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getCurrPlaying() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/spotify/discover", { method: "POST" });
      const data: DiscoverResponse = await response.json();

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Something went wrong, please try again.");
      }

      if ("noActivePlayback" in data) {
        dispatch(setNoActivePlayback());
      } else {
        dispatch(updateDiscoverResults(data));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="currsong">
      <div className="songTitle">
        {currSong ? (
          <h1 className="fixed"> {currSong.songName} </h1>
        ) : (
          <h1 className="overflow">
            {" "}
            Welcome to Explorify! Click the &apos;Start&apos; button to get started{" "}
          </h1>
        )}
      </div>
      <div className="otherInfo">
        <div className="songinfo">
          {currSong ? (
            <div className="albumCover">
              <FlipCard />
            </div>
          ) : (
            <img
              className="albumCover"
              src={emptyMixImage}
              alt="Album Cover"
              width="530"
              height="530"
            />
          )}
          <button className="checkSongButton" onClick={getCurrPlaying} disabled={loading}>
            {" "}
            {loading ? "LOADING..." : "DISCOVER NEW SONGS!"}{" "}
          </button>
          {noActivePlayback && (
            <p className="discoverMessage">
              Nothing is playing right now — start a song on Spotify and try again.
            </p>
          )}
          {error && <p className="discoverError">{error}</p>}
        </div>

        <div className="analyzer">
          {currSong ? (
            <div className="progressBars">
              <h3>Popularity</h3>
              <ProgressBar
                striped
                animated
                now={songAnalysis.popularity}
                style={linearBarStyle}
              />

              <h3>Genres</h3>
              <p className="analysisText">
                {songAnalysis.genres.length !== 0 ? songAnalysis.genres.join(", ") : "Unknown"}
              </p>

              <h3>Release Date</h3>
              <p className="analysisText">{songAnalysis.releaseDate || "Unknown"}</p>

              <h3>Duration</h3>
              <p className="analysisText">{formatDuration(songAnalysis.durationMs)}</p>

              {songAnalysis.explicit && <p className="explicitBadge">EXPLICIT</p>}
            </div>
          ) : (
            <h2> A Picture Here </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrSong;
