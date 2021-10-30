const ipc = window.require("electron").ipcRenderer;

const getSettings = () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:settings:response:get", (event, settings) => {
      resolve(settings);
    });
    ipc.send("musa:settings:request:get");
  });
};

const insertSettings = ({ settings }) => {
  return new Promise((resolve, reject) => {
    ipc.send("musa:settings:request:insert", {
      ...settings,
      isInit: null,
    });
    resolve();
  });
};

const getArtists = async () => {
  return new Promise((resolve, reject) => {
    ipc.on("musa:artists:response", (event, artists) => {
      resolve(artists);
    });
    ipc.send("musa:artists:request");
  });
};

const getArtistById = async (id) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:artist:response", (event, artist) => {
      resolve(artist);
    });
    ipc.send("musa:artist:request", id);
  });
};

const getAlbumById = async (id) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:album:response", (event, album) => {
      resolve(album);
    });
    ipc.send("musa:album:request", id);
  });
};

const getThemes = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:themes:response:getAll", (event, themes) => {
      resolve(themes);
    });
    ipc.send("musa:themes:request:getAll");
  });
};

const insertTheme = async ({ id, colors }) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:themes:response:insert", (theme) => {
      resolve(theme);
    });
    ipc.send("musa:themes:request:insert", id, colors);
  });
};

const getThemeById = async ({ id }) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:themes:response:get", (event, theme) => {
      resolve(theme);
    });
    ipc.send("musa:themes:request:get", id);
  });
};

const removeTheme = async ({ id }) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:themes:response:remove", () => {
      resolve();
    });
    ipc.send("musa:themes:request:remove", id);
  });
};

const addMusicLibraryPath = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:addMusicLibraryPath:response", (event, path) => {
      resolve(path);
    });
    ipc.send("musa:addMusicLibraryPath:request");
  });
};

const onInit = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:ready", (event) => {
      resolve();
    });
    ipc.send("musa:onInit");
  });
};

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
