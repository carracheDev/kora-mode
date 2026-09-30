"use client";

import { deliveryOptions } from "@/core/lib/delivery";
import { formatFCFA } from "@/core/lib/format";

export function ProductServiceInfo() {
  return (
    <aside aria-label="Informations pratiques de démonstration" className="rounded-[var(--radius-card)] border border-line bg-surface-soft p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">Scénario de démonstration</p>
      <div className="mt-3 grid gap-3 text-sm leading-6">
        <div>
          <p className="font-semibold text-ink">Livraison (délais indicatifs)</p>
          <ul className="mt-1 grid gap-1 text-muted">
            {deliveryOptions.map((option) => <li key={option.city}>{option.city} : {formatFCFA(option.fee)} · {option.delay} (indicatif)</li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink">Retour (simulation)</p>
          <p className="text-muted">Scénario de maquette : demande dans les 15 jours ouvrables après réception. Les modalités définitives de KORA MODE restent à définir.</p>
        </div>
      </div>
    </aside>
  );
}
