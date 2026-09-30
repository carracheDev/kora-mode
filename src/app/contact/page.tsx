import type { Metadata } from "next";
import Link from "next/link";
import { modeBrand } from "@/brands/mode/brand";
import { Container } from "@/components/ui/Container";
import { deliveryOptions } from "@/core/lib/delivery";
import { formatFCFA } from "@/core/lib/format";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter KORA MODE pour une question sur un produit ou une commande.",
};

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(
    modeBrand.whatsappNumber,
    "Bonjour KORA MODE, j’ai une question au sujet de votre boutique.",
  );

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <nav aria-label="Fil d’Ariane" className="mb-8 text-sm text-muted">
          <Link className="hover:text-ink" href="/">Accueil</Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span className="text-ink">Contact</span>
        </nav>

        <section className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Nous contacter</p>
          <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Parlons de votre commande</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            Une question sur un article, une taille ou la livraison ? Écrivez-nous sur WhatsApp. Pour une commande, indiquez son numéro dans votre message.
          </p>

          <div className="mt-7 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
            <h2 className="text-xl font-bold text-ink">WhatsApp</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {whatsappUrl
                ? `Numéro de contact : ${modeBrand.whatsappNumber}`
                : "Le numéro WhatsApp n’est pas configuré pour le moment."}
            </p>
            {whatsappUrl && (
              <a
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-6 text-center text-sm font-semibold text-primary-ink hover:bg-primary-hover"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                Écrire sur WhatsApp
              </a>
            )}
            <p className="mt-3 text-xs leading-5 text-muted">Le lien ouvre une conversation ; vous choisissez ensuite si vous envoyez le message.</p>
          </div>

          <section aria-labelledby="payment-title" className="mt-10" id="payment">
            <h2 className="font-heading text-2xl font-bold text-ink" id="payment-title">Moyens de paiement</h2>
            <p className="mt-2 text-sm leading-6 text-muted">La démonstration propose MTN Mobile Money, Moov Money, Celtiis et le paiement à la livraison. Les paiements Mobile Money sont simulés : aucun débit réel n’est effectué.</p>
          </section>

          <section aria-labelledby="questions-title" className="mt-10" id="questions">
            <h2 className="font-heading text-2xl font-bold text-ink" id="questions-title">Questions fréquentes</h2>
            <div className="mt-4 grid gap-4">
              <article className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <h3 className="font-semibold text-ink">Comment suivre ma commande ?</h3>
                <p className="mt-1 text-sm leading-6 text-muted">La référence et le récapitulatif sont visibles après validation et dans l’historique de ce navigateur. Vous pouvez aussi envoyer le récapitulatif sur WhatsApp depuis la confirmation.</p>
              </article>
              <article className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <h3 className="font-semibold text-ink">Les délais et frais sont-ils définitifs ?</h3>
                <p className="mt-1 text-sm leading-6 text-muted">Non. Les montants et délais affichés sont indicatifs pour la démonstration et doivent être confirmés avant une vraie mise en vente.</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="delivery-title" className="mt-10" id="delivery">
            <h2 className="font-heading text-2xl font-bold text-ink" id="delivery-title">Livraison et retours</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Informations indicatives utilisées par cette boutique de démonstration.</p>
            <ul className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
              {deliveryOptions.map((option) => (
                <li className="flex flex-wrap justify-between gap-x-6 gap-y-1 p-4 text-sm" key={option.city}>
                  <span className="font-semibold text-ink">{option.city}</span>
                  <span className="text-muted">{formatFCFA(option.fee)} · {option.delay} (indicatif)</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-muted">
              Retours (simulation) : demande dans les 15 jours ouvrables après réception. Les modalités définitives restent à définir.
            </p>
          </section>
        </section>
      </Container>
    </main>
  );
}
