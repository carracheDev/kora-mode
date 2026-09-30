"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

const reviews = [
  { name: "Aïcha K.", city: "Cotonou", rating: 4.9, text: "La coupe est impeccable et la livraison a été rapide. Je recommande." },
  { name: "Mariam S.", city: "Porto-Novo", rating: 4.8, text: "Très belles finitions, les pièces rendent encore mieux en vrai." },
  { name: "Koffi A.", city: "Parakou", rating: 4.7, text: "Commande simple, bonne qualité et le suivi WhatsApp était très pratique." },
];

export function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const carousel = trackRef.current?.parentElement;
    if (!carousel) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || interacting || !pageVisible || !inView) return;
    const timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % reviews.length;
      trackRef.current?.scrollTo({ left: nextIndex * (trackRef.current.clientWidth || 0), behavior: "smooth" });
      setActiveIndex(nextIndex);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [activeIndex, inView, interacting, pageVisible, paused, reducedMotion]);

  function goTo(index: number) {
    const boundedIndex = (index + reviews.length) % reviews.length;
    trackRef.current?.scrollTo({ left: boundedIndex * (trackRef.current.clientWidth || 0), behavior: "smooth" });
    setActiveIndex(boundedIndex);
  }

  function syncActiveSlide() {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (width > 0) setActiveIndex(Math.min(reviews.length - 1, Math.round(track.scrollLeft / width)));
  }

  return (
    <div
      aria-label="Témoignages clients de démonstration"
      aria-roledescription="carrousel"
      className="mx-auto max-w-4xl"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
      }}
      onFocus={() => setInteracting(true)}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      role="region"
    >
      <div className="flex items-center justify-between gap-3">
        <button
          aria-label="Avis précédent"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => goTo(activeIndex - 1)}
          type="button"
        ><ArrowLeft aria-hidden="true" size={19} /></button>
        <p className="text-center text-xs font-semibold text-muted">Exemples de démonstration · {activeIndex + 1} / {reviews.length}</p>
        <button
          aria-label="Avis suivant"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => goTo(activeIndex + 1)}
          type="button"
        ><ArrowRight aria-hidden="true" size={19} /></button>
      </div>

      <div className="scrollbar-hidden mt-3 flex snap-x snap-mandatory overflow-x-auto" onScroll={syncActiveSlide} ref={trackRef}>
        {reviews.map((review, index) => (
          <div
            aria-label={`${index + 1} sur ${reviews.length}`}
            aria-roledescription="diapositive"
            className="min-w-full snap-start px-1 sm:px-2"
            key={review.name}
            ref={(element) => { slideRefs.current[index] = element; }}
            role="group"
          >
            <Card className="mx-auto grid min-h-56 max-w-3xl content-center !p-6 text-center sm:!p-9">
              <p aria-label={`Note de démonstration : ${review.rating} sur 5`} className="text-star" role="img">★★★★★ <span className="ml-1 text-sm font-semibold text-ink">{review.rating.toFixed(1)}</span></p>
              <blockquote className="mt-4 font-heading text-lg font-semibold leading-7 text-ink sm:text-xl">« {review.text} »</blockquote>
              <p className="mt-5 text-sm font-bold">{review.name} · {review.city}</p>
              <p className="mt-1 text-xs text-muted">Avis fictif pour la démonstration</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {reviews.map((review, index) => (
          <button
            aria-current={activeIndex === index ? "true" : undefined}
            aria-label={`Afficher l’avis ${index + 1}`}
            className={`h-2 rounded-full transition-[width,background-color] ${activeIndex === index ? "w-7 bg-primary" : "w-2 bg-line"}`}
            key={review.name}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
        <button
          aria-label={paused ? "Reprendre le défilement automatique des avis" : "Mettre en pause le défilement automatique des avis"}
          className="ml-2 grid size-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => setPaused((value) => !value)}
          type="button"
        >{paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}</button>
      </div>
    </div>
  );
}
