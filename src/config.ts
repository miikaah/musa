const isElectron = import.meta.env.VITE_ENV === "electron";

export const FALLBACK_THEME = {
  bg: [33, 37, 43],
  primary: [117, 53, 151],
  secondary: [33, 115, 126],
  slider: [117, 53, 151],
  typography: "#fbfbfb",
  typographyPrimary: "#fbfbfb",
  typographySecondary: "#fbfbfb",
};

export const firFileMap = {
  "Audio-Technica ATH-M50x 44.1 kHz": "audio-technica_ath-m50x_44100Hz.wav",
  "Audio-Technica ATH-M50x 48 kHz": "audio-technica_ath-m50x_48000Hz.wav",
  "Bose QuietComfort 35 II 44.1 kHz": "bose_quietcomfort_35_ii_44100Hz.wav",
  "Bose QuietComfort 35 II 48 kHz": "bose_quietcomfort_35_ii_48000Hz.wav",
  "Bose QuietComfort 45 44.1 kHz": "bose_quietcomfort_45_44100Hz.wav",
  "Bose QuietComfort 45 48 kHz": "bose_quietcomfort_45_48000Hz.wav",
  "Sony MDR-V6 44.1 kHz": "sony_mdr_v6_44100Hz.wav",
  "Sony MDR-V6 48 kHz": "sony_mdr_v6_48000Hz.wav",
};

const config = {
  isElectron,
};

export default config;
