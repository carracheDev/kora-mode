"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CampaignBlock } from "@/components/campaigns/CampaignBlock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ToastTrigger } from "@/components/ui/ToastTrigger";
import { Card } from "@/components/ui/Card";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-[65vh] bg-bg py-10 sm:py-14">
      <Container className="grid gap-8">
        <header className="max-w-2xl">
          <p className="eyebrow">Fondation visuelle · étape 1</p>
          <h1 className="mt-3 font-heading font-extrabold">Page d’accueil à venir</h1>
          <p className="mt-4 max-w-xl leading-6 text-muted">
            L’architecture, les composants et les campagnes KORA MODE sont prêts à accueillir les prochains écrans.
          </p>
        </header>

        <section aria-labelledby="ui-test-title" className="grid gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-6">
          <div>
            <p className="eyebrow">Composants partagés</p>
            <h2 className="mt-1 font-heading font-bold" id="ui-test-title">Aperçu du design system</h2>
          </div>
          <div className="grid gap-3 border-b border-line pb-5 sm:grid-cols-3">
            <h3 className="col-span-full">Cartes</h3>
            <Card><p className="font-semibold">Par défaut</p><p className="mt-2 text-sm text-muted">Surface blanche, contour discret et ombre douce.</p></Card>
            <Card variant="interactive"><p className="font-semibold">Interactive</p><p className="mt-2 text-sm text-muted">Élévation au survol, pression légère au toucher.</p></Card>
            <Card variant="soft"><p className="font-semibold">Soft</p><p className="mt-2 text-sm text-muted">Fond doux, sans ombre.</p></Card>
          </div>
          <div className="grid gap-3 border-b border-line pb-5">
            <h3 className="font-bold">Boutons</h3>
            <div className="flex flex-wrap items-center gap-3"><Button variant="primary">Action principale</Button><Button variant="secondary">Secondaire</Button><Button variant="ghost">Discret</Button></div>
          </div>
          <div className="grid gap-3 border-b border-line pb-5">
            <h3 className="font-bold">Badges et retours</h3>
            <div className="flex flex-wrap items-center gap-2"><Badge variant="promo">-40% · Offre</Badge><Badge variant="stock">En stock</Badge><Badge variant="new">Nouveau</Badge></div>
            <div className="flex flex-wrap gap-3"><ToastTrigger kind="success" message="Votre sélection a bien été ajoutée.">Tester le toast succès</ToastTrigger><ToastTrigger kind="favorite" message="Ajouté à vos favoris.">Tester le toast favoris</ToastTrigger><Button onClick={() => setModalOpen(true)} variant="secondary">Ouvrir la modale</Button></div>
          </div>
          <div className="grid gap-3 border-b border-line pb-5 sm:max-w-md">
            <h3 className="font-bold">Champ de formulaire</h3>
            <Input id="design-system-email" label="Adresse e-mail" placeholder="nom@exemple.com" type="email" />
            <Input error="Vérifiez le format de l’adresse." id="design-system-error" label="Exemple d’erreur" placeholder="nom@exemple.com" type="email" />
          </div>
          <div className="grid gap-3">
            <h3 className="flex items-center gap-2 font-bold"><ShoppingBag aria-hidden="true" size={17} /> Thème de campagne actif</h3>
            <CampaignBlock />
          </div>
        </section>
      </Container>
      <Modal onClose={() => setModalOpen(false)} open={modalOpen} title="Fenêtre de démonstration">
        <p className="text-sm leading-6 text-muted">La modale gère le focus visible, la fermeture par Échap et le clic sur le fond.</p>
        <Button className="mt-5" onClick={() => setModalOpen(false)}>Fermer</Button>
      </Modal>
    </main>
  );
}