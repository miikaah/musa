import promiseIpc from "electron-promise-ipc";
import { startsWith } from "lodash-es";

export const isSpotifyAlbum = item => {
  return startsWith(item.uri, "spotify");
};

const play = async tokens => {
  return promiseIpc.send("SpotifyPlay", tokens);
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
