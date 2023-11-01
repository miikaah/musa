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
} from "@miikaah/musa-core";
import * as ElectronApi from "./apiClient.electron";
import * as ServerApi from "./apiClient.server";
import config from "./config";
import { Settings } from "./reducers/settings.reducer";

const { isElectron } = config;

const getSettings = async (): Promise<Settings> => {
  if (isElectron) {
    return ElectronApi.getSettings();
  } else {
    return ServerApi.getSettings();
  }
};

const insertSettings = (settings: Partial<Settings>) => {
  if (isElectron) {
    return ElectronApi.insertSettings(settings);
  } else {
    return ServerApi.insertSettings(settings);
  }
};

const getAudioById = async (idOrUrl: string): Promise<AudioWithMetadata> => {
  if (isElectron) {
    return ElectronApi.getAudioById(idOrUrl);
  } else {
    return ServerApi.getAudioById(idOrUrl);
  }
};

const getArtists = async () => {
  if (isElectron) {
    return ElectronApi.getArtists();
  } else {
    return ServerApi.getArtists();
  }
};

const getArtistById = async (idOrUrl: string): Promise<Artist> => {
  if (isElectron) {
    return ElectronApi.getArtistById(idOrUrl);
  } else {
    return ServerApi.getArtistById(idOrUrl);
  }
};

const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  if (isElectron) {
    return ElectronApi.getArtistAlbums(id);
  } else {
    return ServerApi.getArtistAlbums(id);
  }
};

const getAlbumById = async (
  idOrUrl: string,
): Promise<AlbumWithFilesAndMetadata> => {
  if (isElectron) {
    return ElectronApi.getAlbumById(idOrUrl);
  } else {
    return ServerApi.getAlbumById(idOrUrl);
  }
};

const getThemes = async (): Promise<Theme[]> => {
  if (isElectron) {
    return ElectronApi.getThemes();
  } else {
    return ServerApi.getThemes();
  }
};

const insertTheme = async ({
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

const updateTheme = async ({
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

const getThemeById = async ({ id }: { id: string }): Promise<Theme> => {
  if (isElectron) {
    return ElectronApi.getThemeById({ id });
  } else {
    return ServerApi.getThemeById({ id });
  }
};

const removeTheme = async ({ id }: { id: string }): Promise<void> => {
  if (isElectron) {
    return ElectronApi.removeTheme({ id });
  } else {
    return ServerApi.removeTheme({ id });
  }
};

const getAllGenres = async (): Promise<string[]> => {
  if (isElectron) {
    return ElectronApi.getAllGenres();
  } else {
    return ServerApi.getAllGenres();
  }
};

const find = async (queryToBackend: string): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.find(queryToBackend);
  } else {
    return ServerApi.find(queryToBackend);
  }
};

const findRandom = async (): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.findRandom();
  } else {
    return ServerApi.findRandom();
  }
};

const findRandomWithLockedSearchTerm = async (
  term: string,
): Promise<FindResult> => {
  if (isElectron) {
    return ElectronApi.findRandomWithLockedSearchTerm(term);
  } else {
    return ServerApi.findRandom(term);
  }
};

const writeTags = async (
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

const insertPlaylist = async (pathIds: string[]): Promise<Playlist> => {
  if (isElectron) {
    throw new Error("Not implemented");
  } else {
    return ServerApi.insertPlaylist({ pathIds });
  }
};

const getPlaylist = async (id: string): Promise<Playlist | undefined> => {
  if (isElectron) {
  } else {
    return ServerApi.getPlaylist({ id });
  }
};

const getPlaylistAudios = async (id: string): Promise<AudioWithMetadata[]> => {
  if (isElectron) {
    throw new Error("Not implemented");
  } else {
    return ServerApi.getPlaylistAudios({ id });
  }
};

// Electron specific APIs

const addMusicLibraryPath = async (): Promise<string | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addMusicLibraryPath();
};

const getPlatform = async (): Promise<string | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.getPlatform();
};

const minimizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.minimizeWindow();
};

const maximizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.maximizeWindow();
};

const unmaximizeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.unmaximizeWindow();
};

const isWindowMaximized = async (): Promise<boolean | undefined> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.isWindowMaximized();
};

const closeWindow = async (): Promise<void> => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.closeWindow();
};

const refreshLibrary = () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.refreshLibrary();
};

const onInit = async (): Promise<void> => {
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

const addScanStartListener = (callback: ScanStartListenerCallback) => {
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

const addScanUpdateListener = (callback: ScanUpdateListenerCallback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanUpdateListener(callback);
};

export type ScanEndCompleteListenerCallback = () => void;

const addScanEndListener = (callback: ScanEndCompleteListenerCallback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanEndListener(callback);
};

const addScanCompleteListener = (callback: ScanEndCompleteListenerCallback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanCompleteListener(callback);
};

const getAudiosByFilepaths = (
  paths: string[],
): Promise<AudioWithMetadata[]> => {
  if (!isElectron) {
    throw new Error("Not implemented");
  }

  return ElectronApi.getAudiosByFilepaths(paths);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getSettings,
  insertSettings,
  getAudioById,
  getArtists,
  getArtistById,
  getArtistAlbums,
  getAlbumById,
  getThemes,
  getThemeById,
  insertTheme,
  updateTheme,
  removeTheme,
  getAllGenres,
  find,
  findRandom,
  findRandomWithLockedSearchTerm,
  writeTags,
  insertPlaylist,
  getPlaylist,
  getPlaylistAudios,
  addMusicLibraryPath,
  getPlatform,
  minimizeWindow,
  maximizeWindow,
  unmaximizeWindow,
  isWindowMaximized,
  closeWindow,
  refreshLibrary,
  onInit,
  addScanStartListener,
  addScanUpdateListener,
  addScanEndListener,
  addScanCompleteListener,
  getAudiosByFilepaths,
};
