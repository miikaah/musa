const getSettings = async () => {
  return window.electron.getSettings();
};

const insertSettings = (settings) => {
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

const removeTheme = async ({ id }) => {
  return window.electron.removeThemeById(id);
};

const find = async (query) => {
  return window.electron.find(query);
};

const findRandom = async () => {
  return window.electron.findRandom();
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

const addScanStartListener = (callback) => {
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
