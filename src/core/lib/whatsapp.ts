export function buildWhatsAppUrl(number: string, message: string): string {
  const internationalNumber = number.replace(/\D/g, "");
  const query = encodeURIComponent(message);
  return internationalNumber
    ? `https://wa.me/${internationalNumber}?text=${query}`
    : `https://wa.me/?text=${query}`;
}