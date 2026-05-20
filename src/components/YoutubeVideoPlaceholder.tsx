type YoutubeVideoPlaceholderProps = {
  /** YouTube video ID (e.g. dQw4w9WgXcQ from youtube.com/watch?v=...). Leave empty for placeholder. */
  videoId?: string;
  title?: string;
};

export function YoutubeVideoPlaceholder({
  videoId,
  title = "Zero Pack video",
}: YoutubeVideoPlaceholderProps) {
  if (videoId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-charcoal shadow-lg shadow-slate-300/20 ring-1 ring-slate-200/60">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300/90 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] shadow-sm ring-1 ring-slate-200/50"
      aria-label="Video placeholder"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-compost/90 text-white shadow-md">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-charcoal">YouTube video</p>
      <p className="mt-1 text-xs text-charcoal/60">Placeholder — add your video ID in content</p>
    </div>
  );
}
