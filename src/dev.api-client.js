import ElectronApi from "electron.api-client";
import ServerApi from "server.api-client";
import config from "config";

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

const getArtists = async () => {
  if (isElectron) {
    return ElectronApi.getArtists();
  } else {
    return ServerApi.getArtists();
  }
};

const getArtistById = async (id) => {
  if (isElectron) {
    return ElectronApi.getArtistById(id);
  } else {
    return ServerApi.getArtistById(id);
  }
};

const getArtistAlbums = async (id) => {
  if (isElectron) {
    return ElectronApi.getArtistAlbums(id);
  } else {
    return ServerApi.getArtistAlbums(id);
  }
};

const getAlbumById = async (id) => {
  if (isElectron) {
    return ElectronApi.getAlbumById(id);
  } else {
    return ServerApi.getAlbumById(id);
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

const find = async (queryToBackend) => {
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

// Electron specific Apis

const addMusicLibraryPath = async () => {
  return ElectronApi.addMusicLibraryPath();
};

const getPlatform = async () => {
  return ElectronApi.getPlatform();
};

const minimizeWindow = () => {
  return ElectronApi.minimizeWindow();
};

const maximizeWindow = () => {
  return ElectronApi.maximizeWindow();
};

const unmaximizeWindow = () => {
  return ElectronApi.unmaximizeWindow();
};

const isWindowMaximized = async () => {
  return ElectronApi.isWindowMaximized();
};

const closeWindow = () => {
  return ElectronApi.closeWindow();
};

const refreshLibrary = () => {
  return ElectronApi.refreshLibrary();
};

const onInit = async () => {
  return ElectronApi.onInit();
};

const addScanStartListener = (callback) => {
  return ElectronApi.addScanStartListener(callback);
};

const addScanUpdateListener = (callback) => {
  return ElectronApi.addScanStartListener(callback);
};

const addScanEndListener = (callback) => {
  return ElectronApi.addScanStartListener(callback);
};

const addScanCompleteListener = (callback) => {
  return ElectronApi.addScanStartListener(callback);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getSettings,
  insertSettings,
  getArtists,
  getArtistById,
  getArtistAlbums,
  getAlbumById,
  getThemes,
  getThemeById,
  insertTheme,
  removeTheme,
  find,
  findRandom,
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
};
