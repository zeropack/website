"use client";

type Props = {
  src: string;
  className?: string;
  height?: number;
};

export function MondayFormEmbed({ src, className, height = 1100 }: Props) {
  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      className={className}
      style={{ border: 0, boxShadow: "5px 5px 56px 0px rgba(0,0,0,0.25)" }}
    />
  );
}
