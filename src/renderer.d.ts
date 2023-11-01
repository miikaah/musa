import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistObject,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  Colors,
  FindResult,
  Tags,
  Theme,
} from "@miikaah/musa-core";
import { Settings } from "./reducers/settings.reducer";
import {
  ScanEndCompleteListenerCallback,
  ScanStartListenerCallback,
  ScanUpdateListenerCallback,
} from "./apiClient";

export type ElectronApi = {
  getSettings: () => Promise<Settings>;
  insertSettings: (settings: Partial<Settings>) => Promise<Settings>;
  getArtists: () => Promise<ArtistObject>;
  getArtistById: (id: string) => Promise<Artist>;
  getArtistAlbums: (id: string) => Promise<ArtistWithEnrichedAlbums>;
  getAlbumById: (id: string) => Promise<AlbumWithFilesAndMetadata>;
  getAudioById: (id: string) => Promise<AudioWithMetadata>;
  getAudiosByFilepaths: (paths: string[]) => Promise<AudioWithMetadata[]>;
  getAllThemes: () => Promise<Theme[]>;
  getThemeById: (id: string) => Promise<Theme>;
  insertTheme: (id: string, colors: Colors) => Promise<Theme>;
  updateTheme: (id: string, colors: Colors) => Promise<Theme>;
  removeThemeById: (id: string) => Promise<void>;
  getAllGenres: () => Promise<string[]>;
  find: (query: string) => Promise<FindResult>;
  findRandom: () => Promise<FindResult>;
  findRandomWithLockedSearchTerm: (term: string) => Promise<FindResult>;
  writeTags: (id: string, tags: Tags) => Promise<void>;
  onInit: () => Promise<void>;
  addMusicLibraryPath: () => Promise<string>;
  getPlatform: () => Promise<string>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  unmaximizeWindow: () => Promise<void>;
  isWindowMaximized: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  scan: () => Promise<void>;
  addScanStartListener: (callback: ScanStartListenerCallback) => Promise<void>;
  addScanUpdateListener: (
    callback: ScanUpdateListenerCallback,
  ) => Promise<void>;
  addScanEndListener: (
    callback: ScanEndCompleteListenerCallback,
  ) => Promise<void>;
  addScanCompleteListener: (
    callback: ScanEndCompleteListenerCallback,
  ) => Promise<void>;
};

declare global {
  interface Window {
    electron: ElectronApi;
  }
}
