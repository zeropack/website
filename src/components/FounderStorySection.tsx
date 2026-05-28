import { founderStory } from "@/content/about/founderStory";
import { YoutubeVideoPlaceholder } from "@/components/YoutubeVideoPlaceholder";

export function FounderStorySection() {
  const emphasis = new Set<number>(founderStory.emphasisIndices);

  return (
    <section className="relative overflow-hidden border-t border-slate-200/40 bg-gradient-to-b from-[#f4f7fb] via-white to-[#eef6f3] py-14 sm:py-24">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.12),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.1),transparent_72%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] xl:gap-16">
          <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none lg:sticky lg:top-[calc(var(--site-header-height)+2rem)]">
            <YoutubeVideoPlaceholder
              videoId={founderStory.youtubeVideoId || undefined}
              title={founderStory.title}
              aspectRatio="9:16"
              autoplay
              loop
            />
          </div>

          <div className="mt-10 lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">From our founder</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-4xl">{founderStory.title}</h2>
            <p className="mt-6 text-lg font-medium text-charcoal">{founderStory.intro}</p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal/75 sm:text-lg">
              {founderStory.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    emphasis.has(index)
                      ? "font-heading text-lg font-semibold text-compost sm:text-xl"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 space-y-4 border-t border-slate-200/60 pt-8 text-base leading-relaxed text-charcoal/75 sm:text-lg">
              {founderStory.closing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
