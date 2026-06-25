"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
  minHeight?: number;
};

export function MondayFormEmbed({ src, className, minHeight = 500 }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Only accept messages from Monday.com
      if (!event.origin.includes("monday.com")) return;

      const data = event.data;
      if (!data) return;

      // Monday.com sends height as a plain number, or as { height } or { type, height }
      let newHeight: number | undefined;

      if (typeof data === "number") {
        newHeight = data;
      } else if (typeof data === "object") {
        if (typeof data.height === "number") newHeight = data.height;
        else if (typeof data.frameHeight === "number") newHeight = data.frameHeight;
      }

      if (newHeight && newHeight > minHeight) {
        setHeight(newHeight);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [minHeight]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      height={height}
      className={className}
      style={{ border: 0, boxShadow: "5px 5px 56px 0px rgba(0,0,0,0.25)" }}
    />
  );
}
