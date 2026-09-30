"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { images } from "@/brands/mode/images";
import { Card } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";

const categories = [
  { title: "Femme", href: "/boutique?categorie=vetements&genre=femme", src: images.categories.femme },
  { title: "Homme", href: "/boutique?categorie=vetements&genre=homme", src: images.categories.homme },
  { title: "Accessoires", href: "/boutique?categorie=accessoires", src: images.categories.accessoires },
  { title: "Promos", href: "/boutique?promo=1", src: images.categories.promos },
];

export function CategoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const touching = useRef(false);
  const visible = useRef(false);
  const pageVisible = useRef(true);
  const paused = useRef(true);

  function syncPauseState() {
    paused.current = hovered.current || focused.current || touching.current || !visible.current || !pageVisible.current;
  }

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    const updatePageVisibility = () => {
      pageVisible.current = !document.hidden;
      syncPauseState();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      syncPauseState();
    }, { threshold: 0.1 });

    document.addEventListener("visibilitychange", updatePageVisibility);
    observer.observe(track);
    updatePageVisibility();

    let frame = 0;
    let previousTime = 0;
    const speed = 0.04;
    const animate = (time: number) => {
      if (previousTime && !paused.current) {
        const elapsed = Math.min(time - previousTime, 40);
        track.scrollLeft += elapsed * speed;
        const loopWidth = group.offsetWidth;
        if (loopWidth > 0 && track.scrollLeft >= loopWidth) track.scrollLeft -= loopWidth;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, []);

  function handlePointerDown() {
    touching.current = true;
    syncPauseState();
  }

  function handlePointerEnd() {
    touching.current = false;
    syncPauseState();
  }

  return (
    <div
      aria-label="Explorer les catégories"
      aria-roledescription="carrousel"
      className="-mx-4 sm:mx-0"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          focused.current = false;
          syncPauseState();
        }
      }}
      onFocusCapture={() => {
        focused.current = true;
        syncPauseState();
      }}
      onMouseEnter={() => {
        hovered.current = true;
        syncPauseState();
      }}
      onMouseLeave={() => {
        hovered.current = false;
        syncPauseState();
      }}
      onTouchCancel={handlePointerEnd}
      onTouchEnd={handlePointerEnd}
      onTouchStart={handlePointerDown}
      role="region"
    >
      <div className="scrollbar-hidden flex overflow-x-auto px-4 sm:px-0" ref={trackRef}>
        <div className="flex w-max shrink-0 gap-3 sm:gap-4" ref={groupRef}>
          {categories.map((category) => (
            <div className="w-[78vw] shrink-0 sm:w-[42vw] lg:w-[calc((min(100vw,80rem)-7rem)/4)]" key={category.title}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex w-max shrink-0 gap-3 sm:gap-4" inert>
          {categories.map((category) => (
            <div className="w-[78vw] shrink-0 sm:w-[42vw] lg:w-[calc((min(100vw,80rem)-7rem)/4)]" key={category.title}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  return (
    <Card className="group relative !p-0" variant="interactive">
      <Link aria-label={`Découvrir ${category.title}`} className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]" href={category.href}>
        <SmartImage alt={`Collection ${category.title} KORA MODE`} className="transition-transform duration-300 group-hover:scale-[1.04]" focus={images.focus.categories[category.title.toLowerCase() as keyof typeof images.focus.categories]} sizes="(max-width: 639px) 78vw, (max-width: 1023px) 42vw, 24vw" src={category.src} />
        <span className="category-image-overlay absolute inset-0 flex items-end justify-between gap-2 px-3 pb-3 font-heading text-xl font-bold text-surface sm:px-4 sm:pb-4 sm:text-2xl">
          {category.title}<ArrowUpRight aria-hidden="true" size={19} />
        </span>
      </Link>
    </Card>
  );
}
