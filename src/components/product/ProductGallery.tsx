"use client";

import { useRef, useState } from "react";
import type { Product } from "@/core/types";
import { images } from "@/brands/mode/images";
import { Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";

export function ProductGallery({ product }: { product: Product }) {
  const galleryImages = product.images.length ? product.images : [images.products.placeholder];
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  function selectImage(index: number) {
    setActiveIndex(index);
    trackRef.current?.scrollTo({ left: index * (trackRef.current.clientWidth || 0), behavior: "smooth" });
  }

  return (
    <section aria-label={`Images de ${product.name}`} className="min-w-0">
      <div
        className="scrollbar-hidden flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-card)] bg-surface-soft"
        onScroll={(event) => {
          const track = event.currentTarget;
          if (track.clientWidth) setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
        }}
        ref={trackRef}
      >
        {galleryImages.map((src, index) => (
          <button
            aria-label={`Agrandir l’image ${index + 1}`}
            className="relative block aspect-[4/5] w-full shrink-0 snap-center overflow-hidden"
            key={`${src}-${index}`}
            onClick={() => { setActiveIndex(index); setZoomOpen(true); }}
            type="button"
          >
            <SmartImage alt={`${product.name}, image ${index + 1}`} sizes="(max-width: 1023px) 92vw, 48vw" src={src} />
          </button>
        ))}
      </div>

      {galleryImages.length > 1 ? (
        <>
          <div aria-label="Choisir une image" className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {galleryImages.map((src, index) => (
              <button
                aria-label={`Afficher l’image ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-button)] border ${activeIndex === index ? "border-primary" : "border-line"}`}
                key={`${src}-thumbnail-${index}`}
                onClick={() => selectImage(index)}
                type="button"
              >
                <SmartImage alt="" sizes="64px" src={src} />
              </button>
            ))}
          </div>
          <div aria-label={`Image ${activeIndex + 1} sur ${galleryImages.length}`} className="mt-3 flex justify-center gap-2">
            {galleryImages.map((src, index) => (
              <button
                aria-label={`Aller à l’image ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`size-2 rounded-full ${activeIndex === index ? "bg-primary" : "bg-line"}`}
                key={`${src}-dot-${index}`}
                onClick={() => selectImage(index)}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}

      <Modal onClose={() => setZoomOpen(false)} open={zoomOpen} title={`${product.name} — image ${activeIndex + 1}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-button)] bg-surface-soft">
          <SmartImage alt={`${product.name}, image agrandie`} sizes="(max-width: 639px) 80vw, 448px" src={galleryImages[activeIndex] ?? galleryImages[0]} />
        </div>
      </Modal>
    </section>
  );
}
