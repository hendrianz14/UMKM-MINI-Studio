export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export function isLocale(locale: string | undefined): locale is Locale {
  return locale ? locales.includes(locale as Locale) : false;
}
