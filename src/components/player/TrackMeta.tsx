import type { CurrSong, SongAnalysis } from "@/types/spotify";

interface TrackMetaProps {
  currSong: CurrSong;
  songAnalysis: SongAnalysis;
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Right-hand column of the Now Playing card: title and catalog metadata. */
function TrackMeta({ currSong, songAnalysis }: TrackMetaProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
          Now Playing
        </p>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.01em]">
          {currSong.songName}
        </h1>
        <p className="mt-2 text-base">{currSong.songArtist}</p>
      </div>

      <hr className="h-px border-0" />

      <div>
        <p className="mb-2 text-[13px]">Popularity</p>
        <div
          className="h-[7px] max-w-[320px] overflow-hidden rounded-[4px]"
          role="progressbar"
          aria-label="Popularity"
          aria-valuenow={songAnalysis.popularity}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-[4px]"
            style={{ width: `${songAnalysis.popularity}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-full">
          <p className="mb-2 text-[13px]">Genres</p>
          {songAnalysis.genres.length > 0 ? (
            <ul className="flex list-none flex-wrap gap-[7px] p-0">
              {songAnalysis.genres.map((genre) => (
                <li key={genre} className="rounded-full px-3 py-1.5 text-xs">
                  {genre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Unknown</p>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-[13px]">Release Date</p>
          <p className="text-sm">{songAnalysis.releaseDate || "Unknown"}</p>
        </div>

        <div>
          <p className="mb-1.5 text-[13px]">Duration</p>
          <p className="text-sm">{formatDuration(songAnalysis.durationMs)}</p>
        </div>

        {songAnalysis.explicit && (
          <div className="col-span-full">
            <span className="rounded-[4px] px-2.5 py-[3px] text-xs tracking-widest">
              EXPLICIT
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackMeta;
