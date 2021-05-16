import React, { useEffect, useState } from "react";
import "./RecommendedArtists.css";

// Carousel (Owl Carousel)
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Component
import ArtistCard from "./ArtistCard";

// Redux
import { selectArtistRecommendations } from "../features/songSlice";
import { useSelector } from "react-redux";

function RecommendedArtists() {
  const artistRecommendations = useSelector(selectArtistRecommendations);
  const [localArtists, setLocalArtists] = useState([]);
  return (
    <div className="recommendedArtists">
      <h2> Artists You Might Like </h2>
      {console.log(localArtists)}
      <div className="artists">
        {artistRecommendations.length !== 0 &&
        localArtists !== artistRecommendations ? (
          <>
            <OwlCarousel
              className="owl-theme"
              loop
              items="4"
              dots
              autoplay
              autoplayTimeout="2500"
              nav
              onRefreshed
              // key={`carousel_${artistRecommendations.artists.length}`}
            >
              {artistRecommendations.artists.slice(0, 9).map((artist) => (
                <ArtistCard artist={artist} />
              ))}
            </OwlCarousel>
          </>
        ) : (
          <h2> A Picture Here </h2>
        )}
      </div>
    </div>
  );
}

export default RecommendedArtists;
