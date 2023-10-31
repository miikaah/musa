import { ArtistObject } from "@miikaah/musa-core";
import { Settings } from "./reducers/settings.reducer";
import { ScanStartListenerCallback } from "./apiClient";

export type ElectronApi = {
  getSettings: () => Promise<Settings>;
  insertSettings: (settings: Settings) => Promise<Settings>;
  getArtists: () => Promise<ArtistObject>;
  addScanStartListener: (callback: ScanStartListenerCallback) => Promise<void>;
};

declare global {
  interface Window {
    electron: ElectronApi;
  }
}
