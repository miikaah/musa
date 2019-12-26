import promiseIpc from "electron-promise-ipc";

const play = async (tokens, item) => {
  return promiseIpc.send("SpotifyPlay", tokens, item);
};

const pause = async tokens => {
  return promiseIpc.send("SpotifyPause", tokens);
};

const search = async (tokens, query) => {
  return promiseIpc.send("SpotifySearch", tokens, query);
};

const getAlbumsTracks = async (tokens, item) => {
  return promiseIpc.send("SpotifyGetAlbumsTracks", tokens, item);
};

const Spotify = {
  play,
  pause,
  search,
  getAlbumsTracks
};

export default Spotify;
