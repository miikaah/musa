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
  cover: "",
  isPlaying: false
};

const player = (state = initialState, action) => {
  switch (action.type) {
    case PLAY: {
      // * If play is paused and playlist has items resume playback
      // * else take the first song in the playlist
      let newItem, newIndex, newTime;
      if (!isEmpty(state.currentItem)) {
        newItem = state.currentItem;
        newIndex = state.currentIndex;
        newTime = state.currentTime;
      } else {
        newItem = state.items[0];
        newIndex = 0;
        newTime = 0;
      }
      if (!isEmpty(newItem)) {
        return {
          ...state,
          currentItem: newItem,
          currentIndex: newIndex,
          currentTime: newTime,
          isPlaying: true,
          src: `file://${newItem.path}`,
          cover: isEmpty(newItem.cover) ? "" : `file://${newItem.cover}`
        };
      }
      return {
        ...state,
        isPlaying: false
      };
    }
    case PLAY_ITEM:
    case PLAY_NEXT: {
      const newIndex = isNumber(action.index)
        ? action.index
        : state.currentIndex + 1;
      const newItem = state.items[newIndex];
      if (newItem) {
        return {
          ...state,
          currentItem: newItem,
          currentIndex: newIndex,
          isPlaying: true,
          src: `file://${newItem.path}`,
          cover: isEmpty(newItem.cover) ? "" : `file://${newItem.cover}`
        };
      }
      // We've reached end of playlist.
      // Start it from the beginning.
      return {
        ...initialState,
        items: state.items
      };
    }
    case PAUSE:
      return {
        ...state,
        isPlaying: false
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
    case REMOVE_FROM_PLAYLIST: {
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.index),
        currentIndex:
          action.index < state.currentIndex
            ? state.currentIndex - 1
            : state.currentIndex
      };
    }
    default:
      return state;
  }
};

export default player;
