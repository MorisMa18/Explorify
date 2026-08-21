import emptyMixImage from "../../images/emptymix.svg";

interface AlbumArtProps {
  src: string | null;
  songName: string | null;
}

/**
 * Square cover for the Now Playing card. Replaces the old FlipCard —
 * the design has a static panel, not a 3D hover flip.
 */
function AlbumArt({ src, songName }: AlbumArtProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src ?? emptyMixImage}
      alt={songName ? `Album art for ${songName}` : ""}
      className="aspect-square w-full rounded-art object-cover"
    />
  );
}

export default AlbumArt;
