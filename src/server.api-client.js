const { REACT_APP_API_BASE_URL: baseUrl } = process.env;

const defaultHeaders = {
  "Content-Type": "application/json",
};

const put = async ({ path, body, headers = {} }) => {
  return fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
  });
};

const getSettings = async () => {
  return fetch(`${baseUrl}/state`).then((response) => response.json());
};

const insertSettings = async (settings) => {
  return put({
    path: "/state",
    body: {
      settings: {
        ...settings,
        isInit: null,
      },
    },
  });
};

const getArtists = async () => {
  return fetch(`${baseUrl}/artists`).then((response) => response.json());
};

const getArtistById = async (url) => {
  return fetch(url).then((response) => response.json());
};

const getAlbumById = async (url) => {
  return fetch(url).then((response) => response.json());
};

const getThemes = async () => {
  return fetch(`${baseUrl}/themes`).then((response) => response.json());
};

const insertTheme = async ({ id, colors }) => {
  return put({ path: `/theme/${id.split("/").pop()}`, body: { colors } });
};

const getThemeById = async ({ id }) => {
  return fetch(`${baseUrl}/theme/${id.split("/").pop()}`).then((response) =>
    response.json()
  );
};

const removeTheme = async ({ id }) => {};

const addMusicLibraryPath = async () => {};

const onInit = async () => {};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getSettings,
  insertSettings,
  getArtists,
  getArtistById,
  getAlbumById,
  getThemes,
  insertTheme,
  getThemeById,
  removeTheme,
  addMusicLibraryPath,
  onInit,
};
