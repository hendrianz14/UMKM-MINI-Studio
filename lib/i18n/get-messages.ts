import en from "../../messages/en.json";
import id from "../../messages/id.json";
import { defaultLocale, type Locale, isLocale } from "./config";

const messageMap: Record<Locale, Record<string, string>> = {
  en,
  id
};

export type Messages = typeof en;

export function getMessages(locale: string | undefined): Messages {
  if (isLocale(locale)) {
    return messageMap[locale];
  }
  return messageMap[defaultLocale];
}
