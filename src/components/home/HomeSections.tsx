import Link from "next/link";
import { ArrowRight, Headset, RotateCcw, Truck, WalletCards } from "lucide-react";
import { modeBrand } from "@/brands/mode/brand";
import { products } from "@/brands/mode/products";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { CampaignTeaserCards } from "@/components/home/CampaignTeaserCards";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { ActiveCampaignCollection } from "@/components/home/ActiveCampaignCollection";

const trustItems = [
  { title: "Livraison au Bénin", icon: Truck },
  { title: "Paiement à la livraison", icon: WalletCards },
  { title: "Conditions de retour affichées", icon: RotateCcw },
  { title: "Support WhatsApp", icon: Headset },
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
        <CategoryCarousel />
      </Container>
    </section>
  );
}

export function FlashOfferSection() {
  return <ActiveCampaignCollection />;
}

export function ProductRail({ kind }: { kind: "new" | "bestseller" }) {
  const selected = products.filter((product) => product.tags.includes(kind));
  const title = kind === "new" ? "Nouveautés" : "Sélection KORA";
  const id = kind === "new" ? "nouveautes" : "best-sellers";

  return (
    <section className="py-10 sm:py-14" id={id}>
      <Container>
        <SectionHeading eyebrow={kind === "new" ? "Tout juste arrivés" : "Sélection de démonstration"} title={title} description={kind === "new" ? "Les dernières pièces de la sélection." : "Une sélection de produits mise en avant pour cette démonstration."} />
        <ProductCarousel autoScrollOnMobile={kind === "new"} products={selected} />
      </Container>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-surface-soft py-10 sm:py-14" id="avis">
      <Container>
        <SectionHeading eyebrow="Exemples de démonstration" title="Avis clients" description="Témoignages fictifs affichés pour la démonstration, à remplacer par des avis clients vérifiés." />
        <ReviewsCarousel />
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
          <p className="mt-2 text-sm leading-6 text-muted">Une question sur une taille, une pièce ou la livraison ? {whatsappUrl ? "Écrivez-nous directement." : "Le numéro de démonstration reste à configurer."}</p>
          {whatsappUrl ? <a className="mt-4 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-whatsapp px-5 text-sm font-bold text-surface" href={whatsappUrl} rel="noreferrer" target="_blank">Écrire sur WhatsApp</a> : null}
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