import React, { useEffect } from "react";
import "../components/CurrSong.css";
import emptyMixImage from "../images/emptymix.svg";

// Song Reducer
import { selectSong, selectSongFeature } from "../features/songSlice";
import {
  updateCurrSong,
  updateAudioFeature,
  updateSongRecommendations,
  updateArtistRecommendations,
} from "../features/songSlice";

// UI Components
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FlipCard from "../components/flipCard";

// Spotify API
import SpotifyWebApi from "spotify-web-api-js";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Create instance of Spotify API
const spotify = new SpotifyWebApi();

function CurrSong() {
  // Styling
  const linearBarStyle = { marginBottom: 40 };

  // API and Redux Stuff
  const dispatch = useDispatch();
  const currSong = useSelector(selectSong);
  const currSongFeature = useSelector(selectSongFeature);

  async function getCurrPlaying() {
    // Get current track info
    const currTrack = await spotify.getMyCurrentPlaybackState();
    console.log(currTrack);

    // Get current track's audio info
    const currTrackFeature = await spotify.getAudioFeaturesForTracks(
      `${currTrack.item.id}`
    );
    console.log(currTrackFeature);

    // Get song recommendation
    const songRecommendations = await spotify.getRecommendations({
      limit: 20,
      seed_artists: currTrack.item.artists[0].id,
      seed_tracks: currTrack.item.id,
      target_acousticness: currTrackFeature.audio_features[0].acousticness,
      target_danceability: currTrackFeature.audio_features[0].danceability,
      target_energy: currTrackFeature.audio_features[0].energy,
      starget_instrumentalness:
        currTrackFeature.audio_features[0].instrumentalness,
      target_valence: currTrackFeature.audio_features[0].valence,
      target_speechiness: currTrackFeature.audio_features[0].speechiness,
    });
    console.log(songRecommendations);

    // Get artist recommandation
    const artistRecommendations = await spotify.getArtistRelatedArtists(
      currTrack.item.artists[0].id
    );
    console.log(artistRecommendations);

    dispatch(
      updateCurrSong({
        songId: currTrack.item.id,
        songName: currTrack.item.name,
        songArtist: currTrack.item.artists[0].name,
        songArtistId: currTrack.item.artists[0].id,
        songPicture: currTrack.item.album.images[0].url,
        songPopularity: currTrack.item.popularity,
      })
    );

    dispatch(
      updateAudioFeature({
        songAcousticness: currTrackFeature.audio_features[0].acousticness,
        songDanceability: currTrackFeature.audio_features[0].danceability,
        songEnergy: currTrackFeature.audio_features[0].energy,
        songInstrumentalness:
          currTrackFeature.audio_features[0].instrumentalness,
        songValence: currTrackFeature.audio_features[0].valence,
        songSpeechiness: currTrackFeature.audio_features[0].speechiness,
      })
    );

    dispatch(
      updateSongRecommendations({
        tracks: songRecommendations.tracks,
      })
    );

    dispatch(
      updateArtistRecommendations({
        artists: artistRecommendations.artists,
      })
    );
  }

  return (
    <div className="currsong">
      <div className="songTitle">
        {currSong ? (
          <h1 className="fixed"> {currSong.songName} </h1>
        ) : (
          // <h1 className = 'overflow'> {currSong.songName} </h1>
          <h1 className="overflow">
            {" "}
            Welcome to Explorify! Click the 'Start' button to get started{" "}
          </h1>
        )}
      </div>
      <div className="otherInfo">
        <div className="songinfo">
          {currSong ? (
            <div className="albumCover">
              <FlipCard className="albumCover" />
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
          <button className="checkSongButton" onClick={getCurrPlaying}>
            {" "}
            DISCOVER NEW SONGS!{" "}
          </button>
        </div>

        <div className="analyzer">
          {currSong ? (
            <div className="progressBars">
              <h3>Acousticness</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songAcousticness * 100}
                style={linearBarStyle}
              />

              <h3>Danceability</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songDanceability * 100}
                style={linearBarStyle}
              />

              <h3>Energy</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songEnergy * 100}
                style={linearBarStyle}
              />

              <h3>Instrumentalness</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songInstrumentalness * 100}
                style={linearBarStyle}
              />

              <h3>Valence</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songValence * 100}
                style={linearBarStyle}
              />

              <h3>Speechiness</h3>
              <ProgressBar
                striped
                animated
                now={currSongFeature.songSpeechiness * 100}
                style={linearBarStyle}
              />
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
