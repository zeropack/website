type YoutubeVideoPlaceholderProps = {
  /** YouTube video ID (e.g. dQw4w9WgXcQ from youtube.com/watch?v=...). Leave empty for placeholder. */
  videoId?: string;
  title?: string;
  /** 16:9 landscape (default) or 9:16 portrait for Shorts / mobile-first video. */
  aspectRatio?: "16:9" | "9:16";
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

const aspectClass = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
} as const;

function buildYoutubeEmbedSrc(
  videoId: string,
  { autoplay = false, loop = false, muted = false }: Pick<YoutubeVideoPlaceholderProps, "autoplay" | "loop" | "muted">,
) {
  const params = new URLSearchParams({
    rel: "0",
    playsinline: "1",
  });

  if (autoplay) params.set("autoplay", "1");
  if (muted) params.set("mute", "1");
  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function YoutubeVideoPlaceholder({
  videoId,
  title = "Zero Pack video",
  aspectRatio = "16:9",
  autoplay = false,
  loop = false,
  muted = false,
}: YoutubeVideoPlaceholderProps) {
  const aspect = aspectClass[aspectRatio];

  if (videoId) {
    return (
      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-charcoal shadow-lg shadow-slate-300/20 ring-1 ring-slate-200/60`}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={buildYoutubeEmbedSrc(videoId, { autoplay, loop, muted })}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${aspect} w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300/90 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] shadow-sm ring-1 ring-slate-200/50`}
      aria-label="Video placeholder"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-compost/90 text-white shadow-md">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-charcoal">YouTube video</p>
      <p className="mt-1 px-4 text-center text-xs text-charcoal/60">
        {aspectRatio === "9:16" ? "9:16 portrait — add your video ID in content" : "Placeholder — add your video ID in content"}
      </p>
    </div>
  );
}
