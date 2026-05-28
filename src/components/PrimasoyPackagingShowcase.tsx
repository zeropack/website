"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { SiteImage } from "./SiteImage";
import { type StaticImageData } from "next/image";
import primasoyFrontThumb from "@/content/images/custom/primasoy closup front - 1024 x 1024.png";
import primasoyBackThumb from "@/content/images/custom/primasoy closup back - 1024 x 1024.png";
import primasoyFrontFull from "@/content/images/custom/primasoy closup front.png";
import primasoyBackFull from "@/content/images/custom/primasoy closup back.png";

let fullImagesPreloaded = false;

function preloadFullImages() {
  if (fullImagesPreloaded || typeof window === "undefined") return;
  fullImagesPreloaded = true;
  [primasoyFrontFull, primasoyBackFull].forEach((img) => {
    const el = new window.Image();
    el.src = img.src;
  });
}

export function PrimasoyPackagingShowcase() {
  const [hovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setShowBack(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    preloadFullImages();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const openModal = () => {
    preloadFullImages();
    setShowBack(false);
    setOpen(true);
  };

  const modalImage: StaticImageData = showBack ? primasoyBackFull : primasoyFrontFull;

  const modal =
    open && mounted ? (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="primasoy-packaging-dialog-title"
        onClick={close}
      >
        <div
          className="relative flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl"
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3 sm:px-6">
            <p id="primasoy-packaging-dialog-title" className="font-heading text-lg font-semibold text-charcoal">
              Primasoy packaging
            </p>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-charcoal transition hover:bg-mist"
              aria-label="Close"
            >
              Close
            </button>
          </div>

          <div className="relative min-h-[min(50vh,480px)] w-full flex-1 overflow-hidden bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8]">
            <div className="relative mx-auto aspect-square h-full min-h-[min(50vh,480px)] w-full max-w-2xl">
              <SiteImage
                key={showBack ? "back" : "front"}
                src={modalImage}
                alt={showBack ? "Primasoy packaging — back" : "Primasoy packaging — front"}
                fill
                sizes="(max-width: 768px) 100vw, 48rem"
                className="object-contain p-4 sm:p-6"
                draggable={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200/70 bg-white px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setShowBack(false)}
              className={`min-w-[5.5rem] rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                !showBack
                  ? "bg-compost text-white shadow-sm"
                  : "border-2 border-compost/35 bg-white text-compost hover:bg-mist"
              }`}
              aria-pressed={!showBack}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setShowBack(true)}
              className={`min-w-[5.5rem] rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                showBack
                  ? "bg-compost text-white shadow-sm"
                  : "border-2 border-compost/35 bg-white text-compost hover:bg-mist"
              }`}
              aria-pressed={showBack}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className="group zp-hover-lift relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] shadow-lg shadow-slate-300/25 ring-1 ring-slate-200/60 transition hover:ring-air/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-air focus-visible:ring-offset-2"
        aria-label="View Primasoy packaging close-up"
      >
        <SiteImage
          src={primasoyFrontThumb}
          alt="Primasoy custom compostable packaging — front"
          fill
          sizes="(max-width: 1024px) 100vw, 28rem"
          className={`object-contain p-3 transition-opacity duration-300 ${hovering ? "opacity-0" : "opacity-100"}`}
        />
        <SiteImage
          src={primasoyBackThumb}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 28rem"
          className={`object-contain p-3 transition-opacity duration-300 ${hovering ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        />
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
