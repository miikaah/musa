import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistObject,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  Colors,
  FindResult,
  NormalizationResults,
  Tags,
  Theme,
  NormalizationUnit,
} from "@miikaah/musa-core";
import {
  ScanEndCompleteListenerCallback,
  ScanStartListenerCallback,
  ScanUpdateListenerCallback,
} from "./apiClient";
import { Settings } from "./reducers/settings.reducer";

export const getSettings = async (): Promise<Settings> => {
  return window.electron.getSettings();
};

export const insertSettings = async (
  settings: Partial<Settings>,
): Promise<Settings> => {
  return window.electron.insertSettings(settings);
};

export const getArtists = async (): Promise<ArtistObject> => {
  return window.electron.getArtists();
};

export const getArtistById = async (id: string): Promise<Artist> => {
  return window.electron.getArtistById(id);
};

export const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  return window.electron.getArtistAlbums(id);
};

export const getAlbumById = async (
  id: string,
): Promise<AlbumWithFilesAndMetadata> => {
  return window.electron.getAlbumById(id);
};

export const getAudioById = async (id: string): Promise<AudioWithMetadata> => {
  return window.electron.getAudioById(id);
};

export const getThemes = async (): Promise<Theme[]> => {
  return window.electron.getAllThemes();
};

export const getThemeById = async ({ id }: { id: string }): Promise<Theme> => {
  return window.electron.getThemeById(id);
};

export const insertTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return window.electron.insertTheme(id, colors);
};

export const updateTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return window.electron.updateTheme(id, colors);
};

export const removeTheme = async ({ id }: { id: string }): Promise<void> => {
  return window.electron.removeThemeById(id);
};

export const getAllGenres = async (): Promise<string[]> => {
  return window.electron.getAllGenres();
};

export const find = async (query: string): Promise<FindResult> => {
  return window.electron.find(query);
};

export const findRandom = async (): Promise<FindResult> => {
  return window.electron.findRandom();
};

export const findRandomWithLockedSearchTerm = async (
  term: string,
): Promise<FindResult> => {
  return window.electron.findRandomWithLockedSearchTerm(term);
};

export const writeTags = async (
  id: string,
  tags: Partial<Tags>,
): Promise<undefined | Error> => {
  return window.electron.writeTags(id, tags);
};

export const writeTagsMany = async (
  files: { fid: string; tags: Partial<Tags> }[],
): Promise<undefined | Error> => {
  return window.electron.writeTagsMany(files);
};

// Electron specific Apis

export const onInit = async (): Promise<void> => {
  return window.electron.onInit();
};

export const addMusicLibraryPath = async (): Promise<string> => {
  return window.electron.addMusicLibraryPath();
};

export const getPlatform = async (): Promise<string> => {
  return window.electron.getPlatform();
};

export const minimizeWindow = async (): Promise<void> => {
  await window.electron.minimizeWindow();
};

export const maximizeWindow = async (): Promise<void> => {
  await window.electron.maximizeWindow();
};

export const unmaximizeWindow = async (): Promise<void> => {
  await window.electron.unmaximizeWindow();
};

export const isWindowMaximized = async (): Promise<boolean> => {
  return window.electron.isWindowMaximized();
};

export const closeWindow = async (): Promise<void> => {
  await window.electron.closeWindow();
};

export const refreshLibrary = async (): Promise<void> => {
  await window.electron.scan();
};

export const addScanStartListener = (callback: ScanStartListenerCallback) => {
  window.electron.addScanStartListener(callback);
};

export const addScanUpdateListener = (callback: ScanUpdateListenerCallback) => {
  window.electron.addScanUpdateListener(callback);
};

export const addScanEndListener = (
  callback: ScanEndCompleteListenerCallback,
) => {
  window.electron.addScanEndListener(callback);
};

export const addScanCompleteListener = (
  callback: ScanEndCompleteListenerCallback,
) => {
  window.electron.addScanCompleteListener(callback);
};

export const getAudiosByFilepaths = async (
  paths: FileList,
): Promise<AudioWithMetadata[]> => {
  return window.electron.getAudiosByFilepaths(paths);
};

export const normalizeMany = async (
  units: NormalizationUnit[],
): Promise<NormalizationResults> => {
  return window.electron.normalizeMany(units);
};
