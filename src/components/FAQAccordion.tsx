"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/lib/types";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/10 rounded-2xl border border-black/5 bg-white">
      {items.map((item, i) => {
        const id = `${baseId}-faq-${i}`;
        const expanded = open === i;
        return (
          <div key={item.question} className="px-4 sm:px-6">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-semibold text-charcoal sm:text-lg"
                aria-expanded={expanded}
                aria-controls={`${id}-panel`}
                id={`${id}-button`}
                onClick={() => setOpen(expanded ? null : i)}
              >
                {item.question}
                <span className="text-leaf" aria-hidden>
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-button`}
              hidden={!expanded}
              className={expanded ? "pb-5 text-sm leading-relaxed text-charcoal/75 sm:text-base" : "hidden"}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
