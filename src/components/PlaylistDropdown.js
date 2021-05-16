import React, { useState, useEffect } from "react";
import "./PlaylistDropdown.css";
import { CSSTransition } from "react-transition-group";

// Spotify API
import SpotifyWebApi from "spotify-web-api-js";

// Redux Stuff
import { useSelector } from "react-redux";
import { selectUserPlaylists } from "../features/userSlice";

// Create instance of Spotify API
const spotify = new SpotifyWebApi();

function PlaylistDropdown(props) {
  useEffect(() => {
    setTopCoord();
  });

  const userPlaylists = useSelector(selectUserPlaylists);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);

  function calcHeight(el) {
    // TODO: avoid fixed value
    const height = el.offsetHeight + 30;
    setMenuHeight(height);
  }

  function setTopCoord() {
    document
      .querySelector(":root")
      .style.setProperty("--dropdownTopCoord", props.topCoord);
  }

  // ITEM FOR DROPDOWN
  function DropdownItem(props) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        className="menuItem"
        onClick={() => {
          if (props.goToMenu) {
            setActiveMenu(props.goToMenu);
          } else if (props.trackUri && props.playlistId) {
            spotify.addTracksToPlaylist(props.playlistId, [props.trackUri]);
          }
        }}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }}>
      {/* Main dropdown page  */}
      <CSSTransition
        in={activeMenu === "main"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem> Liked Songs </DropdownItem>
          <DropdownItem goToMenu="playlists"> Add to Playlist </DropdownItem>
        </div>
      </CSSTransition>

      {/* List of user's playlists */}
      <CSSTransition
        in={activeMenu === "playlists"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" />
          {userPlaylists.length !== 0 ? (
            userPlaylists.map((playlist) => (
              <DropdownItem trackUri={props.trackUri} playlistId={playlist.id}>
                {playlist.name}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem> No Playlist </DropdownItem>
          )}
        </div>
      </CSSTransition>
    </div>
  );
}

export default PlaylistDropdown;
