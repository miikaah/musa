import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  FindResult,
} from "@miikaah/musa-core";
import ElectronApi from "./apiClient.electron";
import ServerApi from "./apiClient.server";
import config from "./config";

const { isElectron } = config;

const getSettings = async () => {
  if (isElectron) {
    return ElectronApi.getSettings();
  } else {
    return ServerApi.getSettings();
  }
};

const insertSettings = (settings) => {
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

const getThemes = async () => {
  if (isElectron) {
    return ElectronApi.getThemes();
  } else {
    return ServerApi.getThemes();
  }
};

const insertTheme = async ({ id, colors }) => {
  if (isElectron) {
    return ElectronApi.insertTheme({ id, colors });
  } else {
    return ServerApi.insertTheme({ id, colors });
  }
};

const updateTheme = async ({ id, colors }) => {
  if (isElectron) {
    return ElectronApi.updateTheme({ id, colors });
  } else {
    return ServerApi.updateTheme({ id, colors });
  }
};

const getThemeById = async ({ id }) => {
  if (isElectron) {
    return ElectronApi.getThemeById({ id });
  } else {
    return ServerApi.getThemeById({ id });
  }
};

const removeTheme = async ({ id }) => {
  if (isElectron) {
    return ElectronApi.removeTheme({ id });
  } else {
    return ServerApi.removeTheme({ id });
  }
};

const getAllGenres = async () => {
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

const findRandom = async () => {
  if (isElectron) {
    return ElectronApi.findRandom();
  } else {
    return ServerApi.findRandom();
  }
};

const findRandomWithLockedSearchTerm = async (term) => {
  if (isElectron) {
    return ElectronApi.findRandomWithLockedSearchTerm(term);
  } else {
    return ServerApi.findRandom(term);
  }
};

const writeTags = async (id, tags) => {
  if (isElectron) {
    return ElectronApi.writeTags(id, tags);
  } else {
    console.error("Not implemented");
  }
};

// Server specific APIs

const insertPlaylist = async (pathIds) => {
  if (isElectron) {
  } else {
    return ServerApi.insertPlaylist({ pathIds });
  }
};

const getPlaylist = async (id) => {
  if (isElectron) {
  } else {
    return ServerApi.getPlaylist({ id });
  }
};

const getPlaylistAudios = async (id) => {
  if (isElectron) {
  } else {
    return ServerApi.getPlaylistAudios({ id });
  }
};

// Electron specific APIs

const addMusicLibraryPath = async () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addMusicLibraryPath();
};

const getPlatform = async () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.getPlatform();
};

const minimizeWindow = () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.minimizeWindow();
};

const maximizeWindow = () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.maximizeWindow();
};

const unmaximizeWindow = () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.unmaximizeWindow();
};

const isWindowMaximized = async () => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.isWindowMaximized();
};

const closeWindow = () => {
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

const onInit = async () => {
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

const addScanUpdateListener = (callback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanUpdateListener(callback);
};

const addScanEndListener = (callback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanEndListener(callback);
};

const addScanCompleteListener = (callback) => {
  if (!isElectron) {
    return;
  }

  return ElectronApi.addScanCompleteListener(callback);
};

const getAudiosByFilepaths = (paths) => {
  if (!isElectron) {
    return;
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
