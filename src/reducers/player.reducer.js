import { isNumber, isEmpty, isUndefined } from "lodash-es";
import { encodeFileUri } from "../util";

export const PLAY = "MUSA/PLAYER/PLAY";
export const play = () => ({
  type: PLAY
});

export const PLAY_INDEX = "MUSA/PLAYER/PLAY_INDEX";
export const playIndex = index => ({
  type: PLAY_INDEX,
  index
});

export const PLAY_NEXT = "MUSA/PLAYER/PLAY_NEXT";
export const playNext = () => ({
  type: PLAY_NEXT
});

export const REPLAY = "MUSA/PLAYER/REPLAY";
export const replay = replay => ({
  type: REPLAY,
  replay
});

export const PAUSE = "MUSA/PLAYER/PAUSE";
export const pause = () => ({
  type: PAUSE
});

export const ADD_TO_PLAYLIST = "MUSA/PLAYER/ADD";
export const addToPlaylist = item => ({
  type: ADD_TO_PLAYLIST,
  item
});

export const PASTE_TO_PLAYLIST = "MUSA/PLAYER/PASTE_TO_PLAYLIST";
export const pasteToPlaylist = (items, index) => ({
  type: PASTE_TO_PLAYLIST,
  items,
  index
});

export const REMOVE_RANGE_FROM_PLAYLIST = "MUSA/PLAYER/REMOVE_RANGE";
export const removeRangeFromPlaylist = (startIndex, endIndex) => ({
  type: REMOVE_RANGE_FROM_PLAYLIST,
  startIndex,
  endIndex
});

export const REMOVE_INDEXES_FROM_PLAYLIST =
  "MUSA/PLAYER/REMOVE_INDEXES_FROM_PLAYLIST";
export const removeIndexesFromPlaylist = indexes => ({
  type: REMOVE_INDEXES_FROM_PLAYLIST,
  indexes
});

export const EMPTY_PLAYLIST = "MUSA/PLAYER/EMPTY_PLAYLIST";
export const emptyPlaylist = () => ({
  type: EMPTY_PLAYLIST
});

const initialState = {
  items: [],
  currentItem: {},
  currentIndex: -1,
  src: "",
  cover: "",
  isPlaying: false,
  replay: false
};

const player = (state = initialState, action) => {
  switch (action.type) {
    case PLAY: {
      // * If play is paused and playlist has items resume playback
      // * else take the first song in the playlist
      let newItem, newIndex;
      if (!isEmpty(state.currentItem)) {
        newItem = state.currentItem;
        newIndex = state.currentIndex;
      } else {
        newItem = state.items[0];
        newIndex = 0;
      }
      if (!isEmpty(newItem)) {
        return {
          ...state,
          ...getPlayBase(newItem, newIndex)
        };
      }
      return {
        ...state,
        isPlaying: false
      };
    }
    case PLAY_INDEX:
    case PLAY_NEXT: {
      const newIndex = isNumber(action.index)
        ? action.index
        : state.currentIndex + 1;
      const newItem = state.items[newIndex];
      if (newItem) {
        return {
          ...state,
          ...getPlayBase(newItem, newIndex)
        };
      }
      // We've reached end of playlist.
      // Start it from the beginning.
      return {
        ...initialState,
        items: state.items
      };
    }
    case REPLAY:
      return {
        ...state,
        replay: action.replay
      };
    case PAUSE:
      return {
        ...state,
        isPlaying: false
      };
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case PASTE_TO_PLAYLIST: {
      if (isUndefined(action.index)) {
        const newItems = [...state.items, ...action.items];
        return getStateByPlaylistChange(state, newItems);
      }
      const playlistStart = state.items.slice(0, action.index + 1);
      const playlistEnd = state.items.slice(
        action.index + 1,
        state.items.length
      );
      const newItems = [...playlistStart, ...action.items, ...playlistEnd];
      return getStateByPlaylistChange(state, newItems);
    }
    case REMOVE_RANGE_FROM_PLAYLIST: {
      const newItems = state.items.filter(
        (_, index) => index < action.startIndex || index > action.endIndex
      );
      return getStateByPlaylistChange(state, newItems);
    }
    case REMOVE_INDEXES_FROM_PLAYLIST: {
      const newItems = state.items.filter(
        (_, index) => !action.indexes.includes(index)
      );
      return getStateByPlaylistChange(state, newItems);
    }
    case EMPTY_PLAYLIST: {
      return {
        ...state,
        items: [],
        currentIndex: -1
      };
    }
    default:
      return state;
  }
};

function getPlayBase(newItem, newIndex) {
  return {
    currentItem: newItem,
    currentIndex: newIndex,
    isPlaying: true,
    src: `file://${encodeFileUri(newItem.path)}`,
    cover: isEmpty(newItem.cover)
      ? ""
      : `file://${encodeFileUri(newItem.cover)}`
  };
}

function getStateByPlaylistChange(state, newItems) {
  return {
    ...state,
    items: newItems,
    currentIndex: newItems.indexOf(state.currentItem)
  };
}

export default player;
