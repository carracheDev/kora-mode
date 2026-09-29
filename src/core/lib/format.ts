const fcfaFormatter = new Intl.NumberFormat("fr-BJ", {
  maximumFractionDigits: 0,
});

export function formatFCFA(amount: number): string {
  return `${fcfaFormatter.format(amount)} FCFA`;
}