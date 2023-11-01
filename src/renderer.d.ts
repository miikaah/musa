import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistObject,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  FindResult,
} from "@miikaah/musa-core";
import { Settings } from "./reducers/settings.reducer";
import { ScanStartListenerCallback } from "./apiClient";

export type ElectronApi = {
  getSettings: () => Promise<Settings>;
  insertSettings: (settings: Settings) => Promise<Settings>;
  getArtists: () => Promise<ArtistObject>;
  getArtistById: (id: string) => Promise<Artist>;
  getArtistAlbums: (id: string) => Promise<ArtistWithEnrichedAlbums>;
  getAlbumById: (id: string) => Promise<AlbumWithFilesAndMetadata>;
  getAudioById: (id: string) => Promise<AudioWithMetadata>;
  addScanStartListener: (callback: ScanStartListenerCallback) => Promise<void>;
  find: (query: string) => Promise<FindResult>;
};

declare global {
  interface Window {
    electron: ElectronApi;
  }
}
