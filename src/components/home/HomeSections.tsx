import Link from "next/link";
import { ArrowRight, ArrowUpRight, Headset, RotateCcw, Truck, WalletCards } from "lucide-react";
import type { CSSProperties } from "react";
import { campaigns } from "@/campaigns";
import { modeBrand } from "@/brands/mode/brand";
import { images } from "@/brands/mode/images";
import { products } from "@/brands/mode/products";
import { formatFCFA } from "@/core/lib/format";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ActiveCampaignCountdown } from "@/components/home/CampaignCountdown";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

const trustItems = [
  { title: "Livraison au Bénin", icon: Truck },
  { title: "Paiement à la livraison", icon: WalletCards },
  { title: "Retours faciles", icon: RotateCcw },
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
  const product = products.find((item) => item.oldPrice) ?? products[0];
  if (!product) return null;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <section className="bg-surface-soft py-10 sm:py-14" id="promos">
      <Container>
        <Card className="grid items-center gap-5 !p-3 sm:grid-cols-[0.75fr_1fr] sm:gap-8 sm:!p-5">
          <Link aria-label={`Voir ${product.name}`} className="relative block aspect-[4/5] max-h-[560px] overflow-hidden rounded-[var(--radius-card)] bg-surface-soft" href={`/produit/${product.slug}`}>
            <SmartImage alt={product.name} focus={images.focus.flashOffer} sizes="(max-width: 639px) 88vw, 34vw" src={product.images[0] ?? images.products.urban} />
            {discount ? <div className="absolute left-3 top-3"><Badge variant="promo">-{discount}%</Badge></div> : null}
          </Link>
          <div className="px-2 pb-2 sm:px-0 sm:py-3 sm:pr-5">
            <p className="eyebrow">Offre flash</p>
            <h2 className="mt-2 font-heading font-bold">{product.name}</h2>
            <p className="mt-2 text-sm text-muted">Une pièce choisie pour son confort et sa silhouette contemporaine.</p>
            <ActiveCampaignCountdown className="mt-4" />
            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold">{formatFCFA(product.price)}</span>
              {product.oldPrice ? <del className="text-sm text-promo">{formatFCFA(product.oldPrice)}</del> : null}
            </div>
            <p className="mt-2 text-sm text-muted">Sélection disponible pendant la campagne en cours.</p>
            <Link className="primary-cta mt-4 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] px-5 text-sm font-bold" href={`/produit/${product.slug}`}>Découvrir l’offre</Link>
          </div>
        </Card>
      </Container>
    </section>
  );
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
        <SectionHeading eyebrow="Vos mots" title="Elles et ils en parlent" description="Des retours de clientes et clients au Bénin." />
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
  return (
    <section className="py-10 sm:py-14" aria-labelledby="campaigns-title">
      <Container>
        <SectionHeading eyebrow="Au fil des saisons" title="Trois temps forts, une même boutique" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.values(campaigns).map((campaign) => (
            <Card
              className="campaign-block campaign-card !p-4 sm:!p-5"
              key={campaign.id}
              style={{
                "--camp-bg": campaign.colors.bg,
                "--camp-ink": campaign.colors.ink,
                "--camp-accent": campaign.colors.accent,
                "--camp-accent-ink": campaign.colors.accentInk,
              } as CSSProperties & Record<`--${string}`, string>}
              variant="interactive"
            >
              <p className="eyebrow text-campaign-ink">Campagne KORA</p>
              <h3 className="mt-2 font-heading font-bold">{campaign.name}</h3>
              <p className="mt-2 text-sm leading-6 opacity-85">{campaign.collectionTitle}</p>
              <Link className="campaign-accent mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] px-4 text-sm font-bold" href="#campagne">
                Explorer <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
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