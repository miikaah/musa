let ipc;
if (window.require) {
  ipc = window.require("electron").ipcRenderer;
} else {
  // For dev
  ipc = {
    once: () => {},
    on: () => {},
    send: () => {},
  };
}

const getSettings = () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:settings:response:get", (event, settings) => {
      resolve(settings);
    });
    ipc.send("musa:settings:request:get");
  });
};

const insertSettings = (settings) => {
  return new Promise((resolve, reject) => {
    ipc.send("musa:settings:request:insert", {
      ...settings,
      isInit: null,
    });
    resolve();
  });
};

const getAudioById = async (id) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:audio:response", (event, audio) => {
      resolve(audio);
    });
    ipc.send("musa:audio:request", id);
  });
};

const getArtists = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:artists:response", (event, artists) => {
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

const getArtistAlbums = async (id) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:artistAlbums:response", (event, artist) => {
      resolve(artist);
    });
    ipc.send("musa:artistAlbums:request", id);
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
    ipc.once("musa:themes:response:insert", (event, theme) => {
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

const find = async (queryToBackend) => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:find:response", (event, result) => {
      resolve(result);
    });
    ipc.send("musa:find:request", queryToBackend);
  });
};

const findRandom = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:find:response:random", (event, result) => {
      resolve(result);
    });
    ipc.send("musa:find:request:random");
  });
};

// Electron specific Apis

const addMusicLibraryPath = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:addMusicLibraryPath:response", (event, path) => {
      resolve(path);
    });
    ipc.send("musa:addMusicLibraryPath:request");
  });
};

const getPlatform = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:window:platform:response", (event, platform) => {
      resolve(platform);
    });
    ipc.send("musa:window:platform:request");
  });
};

const minimizeWindow = () => {
  ipc.send("musa:window:minimize");
};

const maximizeWindow = () => {
  ipc.send("musa:window:maximize");
};

const unmaximizeWindow = () => {
  ipc.send("musa:window:unmaximize");
};

const isWindowMaximized = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:window:isMaximized:response", (event, isMaximized) => {
      resolve(isMaximized);
    });
    ipc.send("musa:window:isMaximized:request");
  });
};

const closeWindow = () => {
  ipc.send("musa:window:close");
};

const refreshLibrary = () => {
  ipc.send("musa:scan");
};

const onInit = async () => {
  return new Promise((resolve, reject) => {
    ipc.once("musa:ready", (event) => {
      resolve();
    });
    ipc.send("musa:onInit");
  });
};

const addScanStartListener = (callback) => {
  ipc.on("musa:scan:start", (event, scanLength, scanColor) => {
    callback({ scanLength, scanColor });
  });
};

const addScanUpdateListener = (callback) => {
  ipc.on("musa:scan:update", (event, scannedLength) => {
    callback({ scannedLength });
  });
};

const addScanEndListener = (callback) => {
  ipc.on("musa:scan:end", () => {
    callback();
  });
};

const addScanCompleteListener = (callback) => {
  ipc.on("musa:scan:complete", () => {
    callback();
  });
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
