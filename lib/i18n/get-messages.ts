import en from "../../messages/en.json";
import id from "../../messages/id.json";
import { defaultLocale, type Locale, isLocale } from "./config";

export type Messages = typeof en;

const messageMap: Record<Locale, Messages> = {
  en,
  id
};

export function getMessages(locale: string | undefined): Messages {
  if (isLocale(locale)) {
    return messageMap[locale];
  }
  return messageMap[defaultLocale];
}
