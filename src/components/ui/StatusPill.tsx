interface StatusPillProps {
  children: React.ReactNode;
}

/** The header's "Connected to Spotify" indicator: dot + label. */
function StatusPill({ children }: StatusPillProps) {
  return (
    <div className="flex items-center gap-2 rounded-full">
      <span className="size-[7px] flex-none rounded-full" aria-hidden="true" />
      {children}
    </div>
  );
}

export default StatusPill;
