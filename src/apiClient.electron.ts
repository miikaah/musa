import { ScanStartListenerCallback } from "./apiClient";
import { Settings } from "./reducers/settings.reducer";

const getSettings = async () => {
  return window.electron.getSettings();
};

const insertSettings = async (settings: Settings) => {
  return window.electron.insertSettings(settings);
};

const getArtists = async () => {
  return window.electron.getArtists();
};

const getArtistById = async (id) => {
  return window.electron.getArtistById(id);
};

const getArtistAlbums = async (id) => {
  return window.electron.getArtistAlbums(id);
};

const getAlbumById = async (id) => {
  return window.electron.getAlbumById(id);
};

const getAudioById = async (id) => {
  return window.electron.getAudioById(id);
};

const getThemes = async () => {
  return window.electron.getAllThemes();
};

const getThemeById = async ({ id }) => {
  return window.electron.getThemeById(id);
};

const insertTheme = async ({ id, colors }) => {
  return window.electron.insertTheme(id, colors);
};

const updateTheme = async ({ id, colors }) => {
  return window.electron.updateTheme(id, colors);
};

const removeTheme = async ({ id }) => {
  return window.electron.removeThemeById(id);
};

const getAllGenres = async () => {
  return window.electron.getAllGenres();
};

const find = async (query) => {
  return window.electron.find(query);
};

const findRandom = async () => {
  return window.electron.findRandom();
};

const findRandomWithLockedSearchTerm = async (term) => {
  return window.electron.findRandomWithLockedSearchTerm(term);
};

const writeTags = async (id, tags) => {
  return window.electron.writeTags(id, tags);
};

// Electron specific Apis

const onInit = async () => {
  return window.electron.onInit();
};

const addMusicLibraryPath = async () => {
  return window.electron.addMusicLibraryPath();
};

const getPlatform = async () => {
  return window.electron.getPlatform();
};

const minimizeWindow = () => {
  window.electron.minimizeWindow();
};

const maximizeWindow = () => {
  window.electron.maximizeWindow();
};

const unmaximizeWindow = () => {
  window.electron.unmaximizeWindow();
};

const isWindowMaximized = async () => {
  return window.electron.isWindowMaximized();
};

const closeWindow = () => {
  window.electron.closeWindow();
};

const refreshLibrary = () => {
  window.electron.scan();
};

const addScanStartListener = (callback: ScanStartListenerCallback) => {
  window.electron.addScanStartListener(callback);
};

const addScanUpdateListener = (callback) => {
  window.electron.addScanUpdateListener(callback);
};

const addScanEndListener = (callback) => {
  window.electron.addScanEndListener(callback);
};

const addScanCompleteListener = (callback) => {
  window.electron.addScanCompleteListener(callback);
};

const getAudiosByFilepaths = async (paths) => {
  return window.electron.getAudiosByFilepaths(paths);
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
