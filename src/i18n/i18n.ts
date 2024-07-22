import en from "./en";
import fi from "./fi";

export type TranslationKeys = keyof typeof en;
export type TranslateFn = (key: TranslationKeys) => string;
export type TranslateFnFn = (key: TranslationKeys) => (s: string) => string;
export type SupportedLanguages = "en" | "fi";

const dictionary: Record<
  string,
  Record<string, string | ((s: string) => string)>
> = {
  en,
  fi,
};

export const translate =
  (currentLanguage: SupportedLanguages) => (key: TranslationKeys) => {
    return (
      dictionary[currentLanguage][key] || en[key] || "Translation not found"
    );
  };

export const languages: Array<SupportedLanguages> = ["en", "fi"];
