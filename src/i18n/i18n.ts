import en from "./en";
import fi from "./fi";

export type TranslateFn = (key: string) => string;
export type TranslateFnFn = (key: string) => (s: string) => string;

const dictionary: Record<
  string,
  Record<string, string | ((s: string) => string)>
> = {
  en,
  fi,
};

export const translate = (currentLanguage: string) => (key: string) => {
  return dictionary[currentLanguage][key] || en[key] || "Translation not found";
};

export const languages = ["en", "fi"];
