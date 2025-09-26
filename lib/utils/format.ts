export function formatCurrency(value: number, locale = "id-ID", currency = "IDR") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string | number | Date, locale = "id-ID") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
