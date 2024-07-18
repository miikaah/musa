import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  FindResult,
  Colors,
  Theme,
  Tags,
  Playlist,
  NormalizationUnit,
  NormalizationResults,
} from "@miikaah/musa-core";
import * as ElectronApi from "./apiClient.electron";
import * as ServerApi from "./apiClient.server";
import { isElectron } from "./config";
import { Settings } from "./reducers/settings.reducer";

export const getSettings = async (): Promise<Settings> => {
  if (isElectron) {
    return ElectronApi.getSettings();
  } else {
    return ServerApi.getSettings();
  }
};

export const insertSettings = (settings: Partial<Settings>) => {
  if (isElectron) {
    return ElectronApi.insertSettings(settings);
  } else {
    return ServerApi.insertSettings(settings);
  }
};

export const getAudioById = async (
  idOrUrl: string,
): Promise<AudioWithMetadata> => {
  if (isElectron) {
    return ElectronApi.getAudioById(idOrUrl);
  } else {
    return ServerApi.getAudioById(idOrUrl);
  }
};

export const getArtists = async () => {
  if (isElectron) {
    return ElectronApi.getArtists();
  } else {
    return ServerApi.getArtists();
  }
};

export const getArtistById = async (idOrUrl: string): Promise<Artist> => {
  if (isElectron) {
    return ElectronApi.getArtistById(idOrUrl);
  } else {
    return ServerApi.getArtistById(idOrUrl);
  }
};

export const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  if (isElectron) {
    return ElectronApi.getArtistAlbums(id);
  } else {
    return ServerApi.getArtistAlbums(id);
  }
};

export const getAlbumById = async (
  idOrUrl: string,
): Promise<AlbumWithFilesAndMetadata> => {
  if (isElectron) {
    return ElectronApi.getAlbumById(idOrUrl);
  } else {
    return ServerApi.getAlbumById(idOrUrl);
  }
};

export const getThemes = async (): Promise<Theme[]> => {
  if (isElectron) {
    return ElectronApi.getThemes();
  } else {
    return ServerApi.getThemes();
  }
};

export const insertTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  if (isElectron) {
    return ElectronApi.insertTheme({ id, colors });
  } else {
    return ServerApi.insertTheme({ id, colors });
  }
};

export const updateTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  if (isElectron) {
    return ElectronApi.updateTheme({ id, colors });
  } else {
    return ServerApi.updateTheme({ id, colors });
  }
};

export const getThemeById = async ({ id }: { id: string }): Promise<Theme> => {
  if (isElectron) {
    return ElectronApi.getThemeById({ id });
  } else {
    return ServerApi.getThemeById({ id });
  }
};

export const removeTheme = async ({ id }: { id: string }): Promise<void> => {
  if (isElectron) {
    return ElectronApi.removeTheme({ id });
  } else {
    return ServerApi.removeTheme({ id });
  }
};

export const getAllGenres = async (): Promise<string[]> => {
  if (isElectron) {
    return ElectronApi.getAllGenres();
  } else {
    return ServerApi.getAllGenres();
  }
};

export const find = async (queryToBackend: string): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.find(queryToBackend);
  } else {
    return ServerApi.find(queryToBackend);
  }
};

export const findRandom = async (): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.findRandom();
  } else {
    return ServerApi.findRandom();
  }
};

export const findRandomWithLockedSearchTerm = async (
  term: string,
): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.findRandomWithLockedSearchTerm(term);
  } else {
    return ServerApi.findRandom(term);
  }
};

export const writeTags = async (
  id: string,
  tags: Partial<Tags>,
): Promise<undefined | Error> => {
  if (isElectron) {
    return ElectronApi.writeTags(id, tags);
  } else {
    console.error("Not implemented");
  }
};

// Server specific APIs

export const insertPlaylist = async (pathIds: string[]): Promise<Playlist> => {
  if (isElectron) {
    throw new Error("Not implemented");
  } else {
    return ServerApi.insertPlaylist({ pathIds });
  }
};

export const getPlaylist = async (
  id: string,
): Promise<Playlist | undefined> => {
  if (isElectron) {
  } else {
    return ServerApi.getPlaylist({ id });
  }
};

export const getPlaylistAudios = async (
  id: string,
): Promise<AudioWithMetadata[]> => {
  if (isElectron) {
    throw new Error("Not implemented");
  } else {
    return ServerApi.getPlaylistAudios({ id });
  }
};

// Electron specific APIs

export const addMusicLibraryPath = async (): Promise<string | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addMusicLibraryPath();
};

export const getPlatform = async (): Promise<string | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.getPlatform();
};

export const minimizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.minimizeWindow();
};

export const maximizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.maximizeWindow();
};

export const unmaximizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.unmaximizeWindow();
};

export const isWindowMaximized = async (): Promise<boolean | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.isWindowMaximized();
};

export const closeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.closeWindow();
};

export const refreshLibrary = () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.refreshLibrary();
};

export const onInit = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.onInit();
};

export type ScanStartListenerCallback = ({
  scanLength,
  scanColor,
}: {
  scanLength: number;
  scanColor: string;
}) => void;

export const addScanStartListener = (callback: ScanStartListenerCallback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanStartListener(callback);
};

export type ScanUpdateListenerCallback = ({
  scannedLength,
}: {
  scannedLength: number;
}) => void;

export const addScanUpdateListener = (callback: ScanUpdateListenerCallback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanUpdateListener(callback);
};

export type ScanEndCompleteListenerCallback = () => void;

export const addScanEndListener = (
  callback: ScanEndCompleteListenerCallback,
) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanEndListener(callback);
};

export const addScanCompleteListener = (
  callback: ScanEndCompleteListenerCallback,
) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanCompleteListener(callback);
};

export const getAudiosByFilepaths = (
  paths: string[],
): Promise<AudioWithMetadata[]> => {
  if (!isElectron) {
    throw new Error("Not implemented");
  }

  return ElectronApi.getAudiosByFilepaths(paths);
};

export const normalizeMany = (
  units: NormalizationUnit[],
): Promise<NormalizationResults> => {
  if (!isElectron) {
    throw new Error("Not implemented");
  }

  return ElectronApi.normalizeMany(units);
};
