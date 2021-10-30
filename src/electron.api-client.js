const ipc = window.require("electron").ipcRenderer;

const getSettings = () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:settings:response:get", (event, settings) => {
      resolve(settings);
    });
    ipc.send("musa:settings:request:get");
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
  getArtists,
  getArtistById,
  getAlbumById,
  insertTheme,
  getThemeById,
  onInit,
};
