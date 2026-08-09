"use client";

import { useEffect, useState } from "react";
import "./PlaylistDropdown.css";
import { CSSTransition } from "react-transition-group";

function PlaylistDropdown(props) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [playlistsError, setPlaylistsError] = useState(null);

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Lazy-load: this component only mounts once the "..." button is opened, so
  // playlists are fetched on demand rather than eagerly for every page load.
  useEffect(() => {
    let cancelled = false;

    async function loadPlaylists() {
      try {
        const response = await fetch("/api/spotify/playlists");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load playlists");
        if (!cancelled) setPlaylists(data.playlists);
      } catch (err) {
        if (!cancelled) setPlaylistsError(err.message);
      } finally {
        if (!cancelled) setLoadingPlaylists(false);
      }
    }

    loadPlaylists();
    return () => {
      cancelled = true;
    };
  }, []);

  function calcHeight(el) {
    // TODO: avoid fixed value
    const height = el.offsetHeight + 30;
    setMenuHeight(height);
  }

  async function addToPlaylist(playlistId) {
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/spotify/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackUri: props.trackUri }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to add track");
      setStatusMessage("Added to playlist.");
    } catch (err) {
      setStatusMessage(err.message);
    }
  }

  async function createPlaylistAndAdd(e) {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreating(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/api/spotify/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaylistName, trackUri: props.trackUri }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to create playlist");
      setPlaylists((prev) => [data.playlist, ...prev]);
      setNewPlaylistName("");
      setStatusMessage(`Created "${data.playlist.name}" and added the track.`);
      setActiveMenu("main");
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ITEM FOR DROPDOWN
  function DropdownItem(itemProps) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        className="menuItem"
        onClick={() => {
          if (itemProps.goToMenu) {
            setActiveMenu(itemProps.goToMenu);
          } else if (itemProps.onSelect) {
            itemProps.onSelect();
          }
        }}
      >
        <span className="icon-button">{itemProps.leftIcon}</span>
        {itemProps.children}
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight, top: props.topCoord }}>
      {/* Main dropdown page  */}
      <CSSTransition
        in={activeMenu === "main"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="playlists"> Add to Playlist </DropdownItem>
          <DropdownItem goToMenu="createPlaylist"> Create New Playlist </DropdownItem>
          {statusMessage && <p className="dropdownStatus">{statusMessage}</p>}
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
          <DropdownItem goToMenu="main"> ← Back </DropdownItem>
          {loadingPlaylists ? (
            <DropdownItem> Loading... </DropdownItem>
          ) : playlistsError ? (
            <DropdownItem> {playlistsError} </DropdownItem>
          ) : playlists.length !== 0 ? (
            playlists.map((playlist) => (
              <DropdownItem key={playlist.id} onSelect={() => addToPlaylist(playlist.id)}>
                {playlist.name}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem> No Playlists </DropdownItem>
          )}
        </div>
      </CSSTransition>

      {/* Create a new playlist */}
      <CSSTransition
        in={activeMenu === "createPlaylist"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main"> ← Back </DropdownItem>
          <form className="createPlaylistForm" onSubmit={createPlaylistAndAdd}>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create & Add"}
            </button>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
}

export default PlaylistDropdown;
