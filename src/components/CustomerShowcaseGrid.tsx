import type { CaseStudyCard as CaseStudy } from "@/lib/types";
import { CaseStudyCard } from "./CaseStudyCard";

export function CustomerShowcaseGrid({ studies }: { studies: CaseStudy[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {studies.map((s) => (
        <CaseStudyCard key={s.id} study={s} />
      ))}
    </div>
  );
}
