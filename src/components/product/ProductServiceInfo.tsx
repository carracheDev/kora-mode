"use client";

export function ProductServiceInfo() {
  return (
    <aside aria-label="Informations pratiques de démonstration" className="rounded-[var(--radius-card)] border border-line bg-surface-soft p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">Scénario de démonstration</p>
      <div className="mt-3 grid gap-3 text-sm leading-6">
        <div>
          <p className="font-semibold text-ink">Livraison (délais indicatifs)</p>
          <p className="text-muted">Cotonou et Abomey-Calavi : 24 à 48 h ouvrées. Autres grandes villes : 48 à 72 h ouvrées.</p>
          <p className="text-muted">Tarif de démonstration : 1 000 FCFA à Cotonou / Abomey-Calavi, 3 000 FCFA à Porto-Novo / Parakou.</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Retour (simulation)</p>
          <p className="text-muted">Scénario de maquette : demande dans les 15 jours ouvrables après réception. Les modalités définitives de KORA MODE restent à définir.</p>
        </div>
      </div>
    </aside>
  );
}
