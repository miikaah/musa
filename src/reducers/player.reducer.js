import { store } from "../";
import { isNumber, isEmpty } from "lodash-es";

export const PLAY = "MUSA/PLAYER/PLAY";
export const play = () => ({
  type: PLAY
});

export const PLAY_ITEM = "MUSA/PLAYER/PLAY_ITEM";
export const playItem = (item, index) => ({
  type: PLAY_ITEM,
  item,
  index
});

export const PLAY_NEXT = "MUSA/PLAYER/PLAY_NEXT";
export const playNext = () => ({
  type: PLAY_NEXT
});

export const PAUSE = "MUSA/PLAYER/PAUSE";
export const pause = () => ({
  type: PAUSE
});

export const SET_SOURCE = "MUSA/PLAYER/SET_SOURCE";
export const setSource = src => ({
  type: SET_SOURCE,
  src
});

export const SET_CURRENT_TIME = "MUSA/PLAYER/SET_CURRENT_TIME";
export const setCurrentTime = time => ({
  type: SET_CURRENT_TIME,
  time
});

export const ADD_TO_PLAYLIST = "MUSA/PLAYER/ADD";
export const addToPlaylist = item => ({
  type: ADD_TO_PLAYLIST,
  item
});

export const REMOVE_FROM_PLAYLIST = "MUSA/PLAYER/REMOVE";
export const removeFromPlaylist = index => ({
  type: REMOVE_FROM_PLAYLIST,
  index
});

const initialState = {
  items: [],
  currentItem: {},
  currentIndex: 0,
  currentTime: 0,
  src: "",
  isPlaying: false
};

const player = (state = initialState, action) => {
  switch (action.type) {
    case PLAY:
      // * If play is paused and playlist has items resume playback
      // * else take the first song in the playlist
      const item = !isEmpty(state.currentItem)
        ? state.currentItem
        : state.items[0];
      if (!isEmpty(item)) {
        playSong(item.path.toString());
        return {
          ...state,
          currentItem: item,
          isPlaying: true
        };
      }
      return {
        ...state,
        isPlaying: false
      };
    case PLAY_ITEM:
    case PLAY_NEXT:
      const newIndex = isNumber(action.index)
        ? action.index
        : state.currentIndex + 1;
      const newItem = state.items[newIndex];
      if (newItem) {
        playSong(newItem.path.toString());
        return {
          ...state,
          currentItem: newItem,
          currentIndex: newIndex,
          isPlaying: true
        };
      }
      // We've reached end of playlist
      return {
        ...state,
        isPlaying: false
      };
    case PAUSE:
      return {
        ...state,
        isPlaying: false
      };
    case SET_SOURCE:
      return {
        ...state,
        src: action.src
      };
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time
      };
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case REMOVE_FROM_PLAYLIST:
      return {
        ...state,
        items: state.items.splice(action.index, 1)
      };
    default:
      return state;
  }
};

// Electron side-effects

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function playSong(path) {
  ipcRenderer.send("getSongAsDataUrl", path);
}

ipcRenderer.on("songAsDataUrl", (event, dataUrl) => {
  store.dispatch(setSource(dataUrl));
});

export default player;
