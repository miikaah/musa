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
import {
  ScanEndCompleteListenerCallback,
  ScanStartListenerCallback,
  ScanUpdateListenerCallback,
} from "./apiClient";
import { Settings } from "./reducers/settings.reducer";

const getSettings = async (): Promise<Settings> => {
  return window.electron.getSettings();
};

const insertSettings = async (
  settings: Partial<Settings>,
): Promise<Settings> => {
  return window.electron.insertSettings(settings);
};

const getArtists = async (): Promise<ArtistObject> => {
  return window.electron.getArtists();
};

const getArtistById = async (id: string): Promise<Artist> => {
  return window.electron.getArtistById(id);
};

const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  return window.electron.getArtistAlbums(id);
};

const getAlbumById = async (id: string): Promise<AlbumWithFilesAndMetadata> => {
  return window.electron.getAlbumById(id);
};

const getAudioById = async (id: string): Promise<AudioWithMetadata> => {
  return window.electron.getAudioById(id);
};

const getThemes = async (): Promise<Theme[]> => {
  return window.electron.getAllThemes();
};

const getThemeById = async ({ id }: { id: string }): Promise<Theme> => {
  return window.electron.getThemeById(id);
};

const insertTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return window.electron.insertTheme(id, colors);
};

const updateTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return window.electron.updateTheme(id, colors);
};

const removeTheme = async ({ id }: { id: string }): Promise<void> => {
  return window.electron.removeThemeById(id);
};

const getAllGenres = async (): Promise<string[]> => {
  return window.electron.getAllGenres();
};

const find = async (query: string): Promise<FindResult> => {
  return window.electron.find(query);
};

const findRandom = async (): Promise<FindResult> => {
  return window.electron.findRandom();
};

const findRandomWithLockedSearchTerm = async (
  term: string,
): Promise<FindResult> => {
  return window.electron.findRandomWithLockedSearchTerm(term);
};

const writeTags = async (
  id: string,
  tags: Partial<Tags>,
): Promise<undefined | Error> => {
  return window.electron.writeTags(id, tags);
};

// Electron specific Apis

const onInit = async (): Promise<void> => {
  return window.electron.onInit();
};

const addMusicLibraryPath = async (): Promise<string> => {
  return window.electron.addMusicLibraryPath();
};

const getPlatform = async (): Promise<string> => {
  return window.electron.getPlatform();
};

const minimizeWindow = async (): Promise<void> => {
  await window.electron.minimizeWindow();
};

const maximizeWindow = async (): Promise<void> => {
  await window.electron.maximizeWindow();
};

const unmaximizeWindow = async (): Promise<void> => {
  await window.electron.unmaximizeWindow();
};

const isWindowMaximized = async (): Promise<boolean> => {
  return window.electron.isWindowMaximized();
};

const closeWindow = async (): Promise<void> => {
  await window.electron.closeWindow();
};

const refreshLibrary = async (): Promise<void> => {
  await window.electron.scan();
};

const addScanStartListener = (callback: ScanStartListenerCallback) => {
  window.electron.addScanStartListener(callback);
};

const addScanUpdateListener = (callback: ScanUpdateListenerCallback) => {
  window.electron.addScanUpdateListener(callback);
};

const addScanEndListener = (callback: ScanEndCompleteListenerCallback) => {
  window.electron.addScanEndListener(callback);
};

const addScanCompleteListener = (callback: ScanEndCompleteListenerCallback) => {
  window.electron.addScanCompleteListener(callback);
};

const getAudiosByFilepaths = async (
  paths: string[],
): Promise<AudioWithMetadata[]> => {
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
