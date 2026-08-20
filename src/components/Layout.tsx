import "./Layout.css";

import Navbar from "./Navbar";
import CurrSong from "./CurrSong";
import RecommendedSongs from "./RecommendedSongs";
import RecommendedArtists from "./RecommendedArtists";

function Layout() {
  return (
    <div className="layout">
      {/* Navbar  */}
      <Navbar />

      {/* current song  */}
      <CurrSong />

      {/* recommended songs  */}
      <RecommendedSongs />

      {/* recommended artists  */}
      <RecommendedArtists />
    </div>
  );
}

export default Layout;
