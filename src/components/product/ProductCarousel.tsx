"use client";

import { useCallback, useEffect, useRef, useState, type Ref } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/core/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductCarousel({ products, autoScrollOnMobile = false }: { products: Product[]; autoScrollOnMobile?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const hovered = useRef(false);
  const focused = useRef(false);
  const touching = useRef(false);
  const visible = useRef(false);
  const mobile = useRef(false);
  const pageVisible = useRef(true);
  const paused = useRef(true);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 2);
    setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  const syncPauseState = useCallback(() => {
    paused.current = !autoScrollOnMobile || !mobile.current || hovered.current || focused.current || touching.current || !visible.current || !pageVisible.current;
  }, [autoScrollOnMobile]);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    updateControls();
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(track);

    const mobilePreference = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => {
      mobile.current = mobilePreference.matches;
      syncPauseState();
    };
    const updatePageVisibility = () => {
      pageVisible.current = !document.hidden;
      syncPauseState();
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      syncPauseState();
    }, { threshold: 0.1 });

    mobilePreference.addEventListener("change", updateMobileState);
    document.addEventListener("visibilitychange", updatePageVisibility);
    intersectionObserver.observe(track);
    updateMobileState();
    updatePageVisibility();

    let frame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      if (previousTime && !paused.current) {
        const elapsed = Math.min(time - previousTime, 40);
        track.scrollLeft += elapsed * 0.04;
        const loopWidth = group.offsetWidth;
        if (loopWidth > 0 && track.scrollLeft >= loopWidth) track.scrollLeft -= loopWidth;
      }
      previousTime = time;
      updateControls();
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      mobilePreference.removeEventListener("change", updateMobileState);
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, [syncPauseState, updateControls, products.length]);

  function handleTouchStart() {
    touching.current = true;
    syncPauseState();
  }

  function handleTouchEnd() {
    touching.current = false;
    syncPauseState();
  }

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div
      className="relative"
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
      onTouchCancel={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      role="region"
      aria-label="Produits à découvrir"
      aria-roledescription="carrousel"
    >
      <div
        aria-label="Faire défiler les produits"
        className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:gap-4 sm:px-0"
        onScroll={updateControls}
        ref={trackRef}
      >
        <ProductGroup products={products} groupRef={groupRef} />
        {autoScrollOnMobile ? <ProductGroup ariaHidden className="md:hidden" products={products} /> : null}
      </div>
      <div className="pointer-events-none absolute -top-[58px] right-0 hidden gap-2 md:flex">
        <button
          aria-label="Articles précédents"
          className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-[var(--shadow-card)] transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canGoBack}
          onClick={() => move(-1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <button
          aria-label="Articles suivants"
          className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-[var(--shadow-card)] transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canGoForward}
          onClick={() => move(1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={20} />
        </button>
      </div>
    </div>
  );
}

function ProductGroup({ products, groupRef, ariaHidden = false, className = "" }: { products: Product[]; groupRef?: Ref<HTMLDivElement>; ariaHidden?: boolean; className?: string }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className={`flex w-max shrink-0 gap-3 sm:gap-4 ${className}`} inert={ariaHidden || undefined} ref={groupRef}>
      {products.map((product) => (
        <div className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[42vw] md:w-[calc((100%-48px)/4)] md:max-w-none" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
