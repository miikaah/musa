import { Colors } from "@miikaah/musa-core";
import { ReplaygainKey, ReplaygainType } from "./types";

export const isElectron = import.meta.env.VITE_ENV === "electron";

export const KEYS = {
  Backspace: 8,
  Enter: 13,
  Space: 32,
  Up: 38,
  Down: 40,
  Delete: 46,
  A: 65,
  C: 67,
  D: 68,
  F: 70,
  M: 77,
  V: 86,
  X: 88,
};
export const MAIN_BUTTON_DOWN = 1;

export const REPLAYGAIN_TYPE: Record<ReplaygainKey, ReplaygainType> = {
  Track: "track",
  Album: "album",
  Off: "off",
};

export const VOLUME_MUTED = 0;
export const VOLUME_STEP = 5;
export const VOLUME_DEFAULT = 50;

export const FALLBACK_THEME: Colors = {
  bg: [33, 37, 43],
  primary: [117, 53, 151],
  secondary: [33, 115, 126],
  slider: [117, 53, 151],
  typography: "#fbfbfb",
  typographyPrimary: "#fbfbfb",
  typographySecondary: "#fbfbfb",
  typographyGhost: "#d2d2d2",
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

export const scanColor = {
  INSERT_FILES: "#f00",
  UPDATE_FILES: "#ff0",
  UPDATE_ALBUMS: "#0f0",
};
