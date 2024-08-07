import { AudioWithMetadata } from "@miikaah/musa-core";

export type AudioItem = Omit<AudioWithMetadata, "artistName" | "artistUrl">;

export type CoverData = {
  isCoverLoaded: boolean;
  scaleDownImage: boolean;
  maxHeight: number;
};

export type ReplaygainKey = "Track" | "Album" | "Off";
export type ReplaygainType = "track" | "album" | "off";

export type EditorMode = "normalization" | "metadata";
