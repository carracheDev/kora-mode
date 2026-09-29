"use client";

import Image from "next/image";
import { useState } from "react";

export function SmartImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  focus = "50% 12%",
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  focus?: string;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div
        aria-label={alt}
        className={`smart-image-placeholder absolute inset-0 grid place-items-center ${className}`}
        role="img"
      >
        <span aria-hidden="true" className="font-heading text-lg font-extrabold tracking-[-0.04em] text-muted/50">
          KORA
        </span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={`object-cover ${className}`}
      fill
      onError={() => setMissing(true)}
      priority={priority}
      sizes={sizes}
      src={src}
      style={{ objectPosition: focus }}
    />
  );
}