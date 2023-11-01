import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  FindResult,
} from "@miikaah/musa-core";
import { ScanStartListenerCallback } from "./apiClient";

const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
const defaultHeaders = {
  "Content-Type": "application/json",
};

const get = async (path: string) => {
  return fetch(`${baseUrl}${path}`).then((response) => response.json());
};

const getByUrl = async (url: string) => {
  return fetch(url).then((response) => response.json());
};

const post = async (path: string, { body, headers = {} }) => {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

const put = async (path: string, { body, headers = {} }) => {
  return fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

const patch = async (path: string, { body, headers = {} }) => {
  return fetch(`${baseUrl}${path}`, {
    method: "PATCH",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

const del = async (path: string) => {
  return fetch(`${baseUrl}${path}`, {
    method: "DELETE",
  });
};

const getSettings = async () => {
  return get(`/app-settings`);
};

const insertSettings = async (settings) => {
  return put(`/app-settings`, {
    body: {
      settings: {
        ...settings,
        isInit: null,
      },
    },
  });
};

const getAudioById = async (url: string): Promise<AudioWithMetadata> => {
  return getByUrl(url);
};

const getArtists = async () => {
  return get("/artists");
};

const getArtistById = async (url: string): Promise<Artist> => {
  return getByUrl(url);
};

const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  return get(`/artists/${id}/albums`);
};

const getAlbumById = async (
  url: string,
): Promise<AlbumWithFilesAndMetadata> => {
  return getByUrl(url);
};

const getThemes = async () => {
  return get("/themes");
};

const getThemeById = async ({ id }) => {
  return get(`/themes/${id.split("/").pop()}`);
};

const insertTheme = async ({ id, colors }) => {
  return put(`/themes/${id.split("/").pop()}`, { body: { colors } });
};

const updateTheme = async ({ id, colors }) => {
  return patch(`/themes/${id.split("/").pop()}`, { body: { colors } });
};

const removeTheme = async ({ id }) => {
  return del(`/themes/${id}`);
};

const getAllGenres = async () => {
  return get("/genres");
};

const find = async (queryToBackend: string): Promise<FindResult> => {
  return get(`/find/${queryToBackend}`);
};

const findRandom = async (query?: string) => {
  return query ? get(`/find-random/${query}`) : get("/find-random");
};

// Server specific Apis

const insertPlaylist = async ({ pathIds }) => {
  return post(`/playlists`, { body: { pathIds } });
};

const getPlaylist = async ({ id }) => {
  return get(`/playlists/${id}`);
};

const getPlaylistAudios = async ({ id }) => {
  return get(`/playlists/${id}/audios`);
};

// Electron specific Apis

const addMusicLibraryPath = async () => {};

const getPlatform = async () => {};

const minimizeWindow = () => {};

const maximizeWindow = () => {};

const unmaximizeWindow = () => {};

const isWindowMaximized = async () => {};

const closeWindow = () => {};

const refreshLibrary = () => {};

const onInit = async () => {};

const addScanStartListener = (callback: ScanStartListenerCallback) => {};

const addScanUpdateListener = (callback) => {};

const addScanEndListener = (callback) => {};

const addScanCompleteListener = (callback) => {};

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
};
