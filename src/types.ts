export type CoverData = {
  isCoverLoaded: boolean;
  scaleDownImage: boolean;
  maxHeight: number;
};

export type ColorArray = [number, number, number];

export type Colors = {
  bg: ColorArray;
  primary: ColorArray;
  secondary: ColorArray;
  slider: ColorArray;
  typography: string;
  typographyGhost: string;
  typographyPrimary: string;
  typographySecondary: string;
};

export type ReplaygainKey = "Track" | "Album" | "Off";
export type ReplaygainType = "track" | "album" | "off";
