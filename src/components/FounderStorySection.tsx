import { founderStory } from "@/content/about/founderStory";
import { YoutubeVideoPlaceholder } from "@/components/YoutubeVideoPlaceholder";

export function FounderStorySection() {
  return (
    <section className="relative overflow-hidden bg-[#f3f7f4] py-16 sm:py-24">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.12),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.1),transparent_72%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-[#205b3c]/10 bg-white shadow-[0_24px_70px_rgba(17,24,39,0.08)] lg:grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-stretch xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
          <div className="bg-charcoal p-6 sm:p-10 lg:flex lg:items-center">
            <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
              <YoutubeVideoPlaceholder
                videoId={founderStory.youtubeVideoId || undefined}
                title={founderStory.title}
                aspectRatio="9:16"
                autoplay
                loop
              />
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-air">{founderStory.eyebrow}</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-4xl">{founderStory.title}</h2>
            <p className="mt-6 text-lg font-medium text-charcoal">{founderStory.intro}</p>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-charcoal/75 sm:text-lg">
              {founderStory.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
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
