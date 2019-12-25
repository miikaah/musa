import promiseIpc from "electron-promise-ipc";
import { startsWith } from "lodash-es";

export const isSpotifyAlbum = item => {
  return startsWith(item.uri, "spotify");
};

const play = async token => {
  return promiseIpc.send("SpotifyPlay", token);
};

const pause = async token => {
  return promiseIpc.send("SpotifyPause", token);
};

const search = async (token, query) => {
  return promiseIpc.send("SpotifySearch", token, query);
};

const getAlbumsTracks = async (token, item) => {
  return promiseIpc.send("SpotifyGetAlbumsTracks", token, item);
};

const Spotify = {
  play,
  pause,
  search,
  getAlbumsTracks
};

export default Spotify;
