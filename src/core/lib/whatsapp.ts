export function buildWhatsAppUrl(number: string, message: string): string | null {
  const normalized = number.trim().replace(/[\s().-]/g, "");
  if (!/^\+?\d{8,15}$/.test(normalized)) return null;
  const internationalNumber = normalized.replace(/\D/g, "");
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
