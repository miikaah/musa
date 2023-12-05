import {
  AlbumWithFilesAndMetadata,
  Artist,
  ArtistObject,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
  Colors,
  FindResult,
  Playlist,
  Theme,
} from "@miikaah/musa-core";
import { Settings } from "./reducers/settings.reducer";

const { origin } = window.location;
const isLan = origin.includes("192.168");
const hardcodedBaseUrl = import.meta.env.VITE_API_BASE_URL.split(" ")[0];
const hardcodedLanUrl = import.meta.env.VITE_API_LAN_URL;
const baseUrl = isLan ? origin : hardcodedBaseUrl;
const defaultHeaders = {
  "Content-Type": "application/json",
};

const get = async (path: string) => {
  return fetch(`${baseUrl}${path}`).then((response) => response.json());
};

const getByUrl = async (url: string) => {
  const actualUrl = isLan
    ? url.replace(hardcodedBaseUrl, hardcodedLanUrl)
    : url;

  return fetch(actualUrl).then((response) => response.json());
};

const post = async (
  path: string,
  {
    body,
    headers = {},
  }: { body: Record<string, unknown>; headers?: Record<string, unknown> },
) => {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

const put = async (
  path: string,
  {
    body,
    headers = {},
  }: { body: Record<string, unknown>; headers?: Record<string, unknown> },
) => {
  return fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

const patch = async (
  path: string,
  {
    body,
    headers = {},
  }: { body: Record<string, unknown>; headers?: Record<string, unknown> },
) => {
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

export const getSettings = async (): Promise<Settings> => {
  return get(`/app-settings`);
};

export const insertSettings = async (
  settings: Partial<Settings>,
): Promise<Settings> => {
  return put(`/app-settings`, {
    body: {
      settings: {
        ...settings,
        isInit: null,
      },
    },
  });
};

export const getAudioById = async (url: string): Promise<AudioWithMetadata> => {
  return getByUrl(url);
};

export const getArtists = async (): Promise<ArtistObject> => {
  return get("/artists");
};

export const getArtistById = async (url: string): Promise<Artist> => {
  return getByUrl(url);
};

export const getArtistAlbums = async (
  id: string,
): Promise<ArtistWithEnrichedAlbums> => {
  return get(`/artists/${id}/albums`);
};

export const getAlbumById = async (
  url: string,
): Promise<AlbumWithFilesAndMetadata> => {
  return getByUrl(url);
};

export const getThemes = async (): Promise<Theme[]> => {
  return get("/themes");
};

export const getThemeById = async ({ id }: { id: string }): Promise<Theme> => {
  return get(`/themes/${id.split("/").pop()}`);
};

export const insertTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return put(`/themes/${id.split("/").pop()}`, { body: { colors } });
};

export const updateTheme = async ({
  id,
  colors,
}: {
  id: string;
  colors: Colors;
}): Promise<Theme> => {
  return patch(`/themes/${id.split("/").pop()}`, { body: { colors } });
};

export const removeTheme = async ({ id }: { id: string }): Promise<void> => {
  await del(`/themes/${id}`);
};

export const getAllGenres = async (): Promise<string[]> => {
  return get("/genres");
};

export const find = async (queryToBackend: string): Promise<FindResult> => {
  return get(`/find/${queryToBackend}`);
};

export const findRandom = async (query?: string): Promise<FindResult> => {
  return query ? get(`/find-random/${query}`) : get("/find-random");
};

// Server specific Apis

export const insertPlaylist = async ({
  pathIds,
}: {
  pathIds: string[];
}): Promise<Playlist> => {
  return post(`/playlists`, { body: { pathIds } });
};

export const getPlaylist = async ({
  id,
}: {
  id: string;
}): Promise<Playlist | undefined> => {
  return get(`/playlists/${id}`);
};

export const getPlaylistAudios = async ({
  id,
}: {
  id: string;
}): Promise<AudioWithMetadata[]> => {
  return get(`/playlists/${id}/audios`);
};

// Electron specific Apis

export const addMusicLibraryPath = async () => {};

export const getPlatform = async () => {};

export const minimizeWindow = () => {};

export const maximizeWindow = () => {};

export const unmaximizeWindow = () => {};

export const isWindowMaximized = async () => {};

export const closeWindow = () => {};

export const refreshLibrary = () => {};

export const onInit = async () => {};

export const addScanStartListener = () => {};

export const addScanUpdateListener = () => {};

export const addScanEndListener = () => {};

export const addScanCompleteListener = () => {};
