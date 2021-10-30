const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

export const FALLBACK_THEME = {
  bg: [33, 37, 43],
  primary: [117, 53, 151],
  secondary: [33, 115, 126],
  slider: [117, 53, 151],
  typography: "#fbfbfb",
  typographyPrimary: "#fbfbfb",
  typographySecondary: "#fbfbfb",
};

const config = {
  isElectron,
};

export default config;
