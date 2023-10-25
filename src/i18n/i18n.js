import en from "./en";
import fi from "./fi";

const dictionary = {
  en,
  fi,
};

export const translate = (currentLanguage) => (key) => {
  return dictionary[currentLanguage][key] || en[key] || "Translation not found";
};

export const languages = ["en", "fi"];
