"use client";

import dynamic from "next/dynamic";
import "./RecommendedArtists.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Component
import ArtistCard from "./ArtistCard";

// Redux
import { selectArtistRecommendations } from "@/store/songSlice";
import { useSelector } from "react-redux";

// owl.carousel (bundled inside react-owl-carousel's UMD build) is old enough to call
// several jQuery utility methods that jQuery's newer ESM build (what a bare
// `import("jquery")` resolves to under webpack) has dropped, even though jQuery 3.x's
// classic build still carries them. Import that classic build explicitly, and keep a
// small guarded polyfill on top as a safety net for anything still missing.
function polyfillLegacyJqueryUtils($) {
  if (!$.camelCase) {
    $.camelCase = (string) => string.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  if (!$.type) {
    $.type = (obj) => {
      if (obj == null) return `${obj}`;
      return typeof obj === "object" || typeof obj === "function"
        ? Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
        : typeof obj;
    };
  }
  if (!$.isFunction) {
    $.isFunction = (obj) => typeof obj === "function";
  }
  if (!$.isArray) {
    $.isArray = Array.isArray;
  }
  if (!$.isWindow) {
    $.isWindow = (obj) => obj != null && obj === obj.window;
  }
  if (!$.trim) {
    $.trim = (text) => (text == null ? "" : String(text).trim());
  }
}

// react-owl-carousel's UMD bundle isn't a real module consumer of jQuery — it expects
// a global window.jQuery/$ to already exist (this is how the old CRA app worked too,
// via a <script> tag loading jQuery globally). Attach it before react-owl-carousel
// is imported, and only client-side, since it touches `window` at import time.
const OwlCarousel = dynamic(
  () =>
    import("jquery/dist/jquery.js").then(({ default: $ }) => {
      window.jQuery = $;
      window.$ = $;
      polyfillLegacyJqueryUtils($);
      return import("react-owl-carousel");
    }),
  { ssr: false }
);

function RecommendedArtists() {
  const artistRecommendations = useSelector(selectArtistRecommendations);

  return (
    <div className="recommendedArtists">
      <h2> Artists You Might Like </h2>
      <div className="artists">
        {artistRecommendations.length !== 0 ? (
          <OwlCarousel className="owl-theme" loop items="4" dots autoplay autoplayTimeout="2500" nav>
            {artistRecommendations.slice(0, 9).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </OwlCarousel>
        ) : (
          <h2> A Picture Here </h2>
        )}
      </div>
    </div>
  );
}

export default RecommendedArtists;
