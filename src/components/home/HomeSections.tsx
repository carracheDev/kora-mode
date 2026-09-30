import Link from "next/link";
import { ArrowRight, ArrowUpRight, Headset, RotateCcw, Truck, WalletCards } from "lucide-react";
import { modeBrand } from "@/brands/mode/brand";
import { images } from "@/brands/mode/images";
import { products } from "@/brands/mode/products";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { CampaignTeaserCards } from "@/components/home/CampaignTeaserCards";
import { ActiveCampaignCollection } from "@/components/home/ActiveCampaignCollection";

const trustItems = [
  { title: "Livraison au Bénin", icon: Truck },
  { title: "Paiement à la livraison", icon: WalletCards },
  { title: "Conditions de retour affichées", icon: RotateCcw },
  { title: "Support WhatsApp", icon: Headset },
];

const categories = [
  { title: "Femme", href: "/boutique?categorie=vetements&genre=femme", src: images.categories.femme },
  { title: "Homme", href: "/boutique?categorie=vetements&genre=homme", src: images.categories.homme },
  { title: "Accessoires", href: "/boutique?categorie=accessoires", src: images.categories.accessoires },
  { title: "Promos", href: "/boutique?promo=1", src: images.categories.promos },
];

const reviews = [
  { name: "Aïcha K.", city: "Cotonou", rating: 4.9, text: "La coupe est impeccable et la livraison a été rapide. Je recommande." },
  { name: "Mariam S.", city: "Porto-Novo", rating: 4.8, text: "Très belles finitions, les pièces rendent encore mieux en vrai." },
  { name: "Koffi A.", city: "Parakou", rating: 4.7, text: "Commande simple, bonne qualité et le suivi WhatsApp était très pratique." },
];

function SectionHeading({ eyebrow, title, description, href }: { eyebrow: string; title: string; description?: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 font-heading font-bold">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm text-muted">{description}</p> : null}
      </div>
      {href ? <Link className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary sm:inline-flex" href={href}>Tout voir <ArrowRight aria-hidden="true" size={16} /></Link> : null}
    </div>
  );
}

export function TrustStrip() {
  return (
    <section aria-label="Nos engagements" className="bg-surface-soft py-4">
      <Container>
        <div className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0">
          {trustItems.map(({ title, icon: Icon }) => (
            <Card className="flex min-w-[220px] snap-start items-center gap-3 !p-3 sm:min-w-0" key={title} variant="soft">
              <Icon aria-hidden="true" className="shrink-0 text-primary" size={19} />
              <span className="text-sm font-semibold">{title}</span>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="py-10 sm:py-14" id="categories">
      <Container>
        <SectionHeading eyebrow="Explorer" title="Trouver votre style" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Card className="group relative !p-0" key={category.title} variant="interactive">
              <Link aria-label={`Découvrir ${category.title}`} className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]" href={category.href}>
                <SmartImage alt={`Collection ${category.title} KORA MODE`} className="transition-transform duration-300 group-hover:scale-[1.04]" focus={images.focus.categories[category.title.toLowerCase() as keyof typeof images.focus.categories]} sizes="(max-width: 639px) 45vw, 24vw" src={category.src} />
                <span className="category-image-overlay absolute inset-0 flex items-end justify-between gap-2 px-3 pb-3 font-heading text-xl font-bold text-surface sm:px-4 sm:pb-4 sm:text-2xl">
                  {category.title}<ArrowUpRight aria-hidden="true" size={19} />
                </span>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FlashOfferSection() {
  return <ActiveCampaignCollection />;
}

export function ProductRail({ kind }: { kind: "new" | "bestseller" }) {
  const selected = products.filter((product) => product.tags.includes(kind));
  const title = kind === "new" ? "Nouveautés" : "Les plus vendus";
  const id = kind === "new" ? "nouveautes" : "best-sellers";

  return (
    <section className="py-10 sm:py-14" id={id}>
      <Container>
        <SectionHeading eyebrow={kind === "new" ? "Tout juste arrivés" : "Les favoris KORA"} title={title} description={kind === "new" ? "Les dernières pièces de la sélection." : "Les pièces choisies par la communauté."} />
        {kind === "new" ? (
          <ProductCarousel products={selected} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {selected.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </Container>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-surface-soft py-10 sm:py-14" id="avis">
      <Container>
        <SectionHeading eyebrow="Exemples de démonstration" title="Avis clients" description="Témoignages fictifs affichés pour la démonstration, à remplacer par des avis clients vérifiés." />
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {reviews.map((review) => (
            <Card key={review.name}>
              <p aria-label={`Note ${review.rating} sur 5`} className="text-star" role="img">★★★★★ <span className="ml-1 text-sm font-semibold text-ink">{review.rating.toFixed(1)}</span></p>
              <blockquote className="mt-3 text-sm leading-6">« {review.text} »</blockquote>
              <p className="mt-4 text-sm font-bold">{review.name}</p>
              <p className="text-sm text-muted">{review.city}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CampaignTeasers() {
  return <CampaignTeaserCards />;
}

export function WhatsAppAndNewsletter() {
  const whatsappUrl = buildWhatsAppUrl(modeBrand.whatsappNumber, "Bonjour, je souhaite en savoir plus sur KORA MODE.");

  return (
    <section className="py-10 sm:py-14">
      <Container className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-surface-mint !shadow-none">
          <p className="eyebrow">Besoin d’un conseil ?</p>
          <h2 className="mt-2 font-heading font-bold">Échangeons sur WhatsApp</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Une question sur une taille, une pièce ou la livraison ? Notre équipe est là.</p>
          <a className="mt-4 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-whatsapp px-5 text-sm font-bold text-surface" href={whatsappUrl} rel="noreferrer" target="_blank">Écrire sur WhatsApp</a>
        </Card>
        <Card className="flex flex-col justify-center">
          <p className="eyebrow">La lettre KORA</p>
          <h2 className="mt-2 font-heading font-bold">Un œil sur les nouveautés</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Recevez les nouvelles collections et sélections directement dans votre boîte mail.</p>
          <NewsletterSignup />
        </Card>
      </Container>
    </section>
  );
}

export function HomeSectionIntro() {
  return <p className="sr-only">Boutique KORA MODE, prêt-à-porter premium au Bénin.</p>;
}