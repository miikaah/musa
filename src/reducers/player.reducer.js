import isEmpty from "lodash.isempty";
import { cleanUrl } from "../util";

export const PLAY = "MUSA/PLAYER/PLAY";
export const play = () => ({
  type: PLAY,
});

export const PLAY_INDEX = "MUSA/PLAYER/PLAY_INDEX";
export const playIndex = (index) => ({
  type: PLAY_INDEX,
  index,
});

export const PLAY_NEXT = "MUSA/PLAYER/PLAY_NEXT";
export const playNext = () => ({
  type: PLAY_NEXT,
});

export const REPLAY = "MUSA/PLAYER/REPLAY";
export const replay = (replay) => ({
  type: REPLAY,
  replay,
});

export const PAUSE = "MUSA/PLAYER/PAUSE";
export const pause = () => ({
  type: PAUSE,
});

export const ADD_TO_PLAYLIST = "MUSA/PLAYER/ADD";
export const addToPlaylist = (item) => ({
  type: ADD_TO_PLAYLIST,
  item,
});

export const PASTE_TO_PLAYLIST = "MUSA/PLAYER/PASTE_TO_PLAYLIST";
export const pasteToPlaylist = (items, index) => ({
  type: PASTE_TO_PLAYLIST,
  items,
  index,
});

export const REMOVE_INDEXES_FROM_PLAYLIST =
  "MUSA/PLAYER/REMOVE_INDEXES_FROM_PLAYLIST";
export const removeIndexesFromPlaylist = (indexes) => ({
  type: REMOVE_INDEXES_FROM_PLAYLIST,
  indexes,
});

export const EMPTY_PLAYLIST = "MUSA/PLAYER/EMPTY_PLAYLIST";
export const emptyPlaylist = () => ({
  type: EMPTY_PLAYLIST,
});

const initialState = {
  items: [],
  currentItem: {},
  currentIndex: -1,
  src: "",
  coverUrl: "",
  isPlaying: false,
  replay: false,
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
          ...getPlayBase(newItem, newIndex),
        };
      }

      return {
        ...state,
        isPlaying: false,
      };
    }
    case PLAY_INDEX:
    case PLAY_NEXT: {
      const newIndex =
        typeof action.index === "number"
          ? action.index
          : state.currentIndex + 1;
      const newItem = state.items[newIndex];

      if (newItem) {
        // This is a duplicate play so need to set replay even though index is moved forward
        if (state.currentItem?.id === newItem.id) {
          return {
            ...state,
            ...getPlayBase(newItem, newIndex),
            replay: true,
          };
        }

        // Move to next index
        return {
          ...state,
          ...getPlayBase(newItem, newIndex),
        };
      }
      // We've reached end of playlist.
      // Start it from the beginning.
      return {
        ...initialState,
        items: state.items,
      };
    }
    case REPLAY:
      return {
        ...state,
        replay: action.replay,
      };
    case PAUSE:
      return {
        ...state,
        isPlaying: false,
      };
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        items: [...state.items, action.item],
      };
    case PASTE_TO_PLAYLIST: {
      // The action doesn't have index set so append items to the end of the playlist
      if (!action.index && action.index !== 0) {
        const newItems = [...state.items, ...action.items];

        return getStateByPlaylistChange(state, newItems, state.currentIndex);
      }

      const playlistStart = state.items.slice(0, action.index + 1);
      const playlistEnd = state.items.slice(
        action.index + 1,
        state.items.length
      );
      const newItems = [...playlistStart, ...action.items, ...playlistEnd];
      const newIndex =
        action.index < state.currentIndex
          ? action.items.length + state.currentIndex
          : state.currentIndex;

      return getStateByPlaylistChange(state, newItems, newIndex);
    }
    case REMOVE_INDEXES_FROM_PLAYLIST: {
      const newItems = state.items.filter(
        (_, index) => !action.indexes.includes(index)
      );
      const isRemovingCurrentIndex = action.indexes.includes(
        state.currentIndex
      );
      const indexesBelowCurrentIndex = action.indexes.filter(
        (i) => i < state.currentIndex
      );
      const newIndex = isRemovingCurrentIndex
        ? -1
        : state.currentIndex - indexesBelowCurrentIndex.length;

      return getStateByPlaylistChange(state, newItems, newIndex);
    }
    case EMPTY_PLAYLIST: {
      return {
        ...state,
        items: [],
        currentIndex: -1,
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
    src: cleanUrl(newItem.fileUrl),
    coverUrl: cleanUrl(newItem.coverUrl) || "",
  };
}

function getStateByPlaylistChange(state, newItems, currentIndex) {
  return {
    ...state,
    items: newItems,
    currentIndex,
  };
}

export default player;
