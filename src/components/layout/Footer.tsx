import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { modeBrand } from "@/brands/mode/brand";
import Link from "next/link";

const storefrontLinks: Record<string, string> = {
  Nouveautés: "/boutique?tri=nouveautes",
  Vêtements: "/boutique?categorie=vetements",
  Accessoires: "/boutique?categorie=accessoires",
  Promotions: "/boutique?promo=1",
};

export function Footer() {
  return (
    <footer className="border-t border-footer-divider bg-ink pt-12 pb-32 text-footer-text sm:pt-16 sm:pb-32">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.5fr]">
          <div>
            <Link className="font-heading text-2xl font-extrabold tracking-[-0.04em] text-surface" href="/">
              KORA <span className="font-sans text-xs tracking-normal">MODE</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-footer-text">
              Une mode contemporaine, choisie avec attention.
            </p>
          </div>

          {modeBrand.footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-surface">{column.title}</h3>
              <ul className="mt-4 grid gap-3 text-sm text-footer-text">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link className="hover:text-surface" href={storefrontLinks[link] ?? `#${link.toLowerCase().replaceAll(" ", "-")}`}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-bold text-surface">Paiement</h3>
            <ul className="mt-4 grid gap-3 text-sm text-footer-text">
              {modeBrand.footer.paymentMethods.map((method) => <li key={method}>{method}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-surface">{modeBrand.footer.newsletter.title}</h3>
            <p className="mt-2 text-sm leading-6 text-footer-text">{modeBrand.footer.newsletter.description}</p>
            <form className="mt-4 grid gap-3 [&_label]:text-surface">
              <Input autoComplete="email" label="Votre adresse e-mail" name="footer-email" placeholder="nom@exemple.com" type="email" />
              <Button type="submit">S’inscrire</Button>
            </form>
            <div className="mt-5 flex gap-4 text-sm">
              {modeBrand.footer.socialLinks.map((social) => <span key={social}>{social}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-footer-divider pt-5 text-sm text-footer-text">
          © {new Date().getFullYear()} KORA MODE · {modeBrand.deliveryInfo}
        </div>
      </Container>
    </footer>
  );
}