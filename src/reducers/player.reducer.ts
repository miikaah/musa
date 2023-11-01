import {
  Artist,
  AudioWithMetadata,
  File as MusaFile,
} from "@miikaah/musa-core";
import isEmpty from "lodash.isempty";
import { cleanUrl } from "../util";
import { CoverData } from "../types";
import { EnrichedAlbumFile } from "@miikaah/musa-core/lib/db.types";

export const PLAY = "MUSA/PLAYER/PLAY";
export type PlayAction = {
  type: typeof PLAY;
};
export const play = () => ({
  type: PLAY,
});

export const PLAY_INDEX = "MUSA/PLAYER/PLAY_INDEX";
export type PlayIndexAction = {
  type: typeof PLAY_INDEX;
  index: number;
};
export const playIndex = (index: number) => ({
  type: PLAY_INDEX,
  index,
});

export const PLAY_NEXT = "MUSA/PLAYER/PLAY_NEXT";
export type PlayNextAction = {
  type: typeof PLAY_NEXT;
};
export const playNext = () => ({
  type: PLAY_NEXT,
});

export const REPLAY = "MUSA/PLAYER/REPLAY";
export type ReplayAction = {
  type: typeof REPLAY;
  replay: boolean;
};
export const replay = (replay: boolean) => ({
  type: REPLAY,
  replay,
});

export const PAUSE = "MUSA/PLAYER/PAUSE";
export type PauseAction = {
  type: typeof PAUSE;
};
export const pause = () => ({
  type: PAUSE,
});

export const ADD_TO_PLAYLIST = "MUSA/PLAYER/ADD";
export type AddToPlaylistAction = {
  type: typeof ADD_TO_PLAYLIST;
  item: AudioWithMetadata;
};
export const addToPlaylist = (
  item: AudioWithMetadata | EnrichedAlbumFile | Artist["albums"][0],
) => ({
  type: ADD_TO_PLAYLIST,
  item,
});

export const PASTE_TO_PLAYLIST = "MUSA/PLAYER/PASTE_TO_PLAYLIST";
export type PasteToPlaylistAction = {
  type: typeof PASTE_TO_PLAYLIST;
  items: AudioWithMetadata[];
  index: number;
};
export const pasteToPlaylist = (
  items: AudioWithMetadata[] | EnrichedAlbumFile[] | MusaFile[],
  index?: number,
) => ({
  type: PASTE_TO_PLAYLIST,
  items,
  index,
});

export const REMOVE_INDEXES_FROM_PLAYLIST =
  "MUSA/PLAYER/REMOVE_INDEXES_FROM_PLAYLIST";
export type RemoveIndexesFromPlaylistAction = {
  type: typeof REMOVE_INDEXES_FROM_PLAYLIST;
  indexes: number[];
};
export const removeIndexesFromPlaylist = (indexes: number[]) => ({
  type: REMOVE_INDEXES_FROM_PLAYLIST,
  indexes,
});

export const EMPTY_PLAYLIST = "MUSA/PLAYER/EMPTY_PLAYLIST";
export type EmptyPlaylistAction = {
  type: typeof EMPTY_PLAYLIST;
};
export const emptyPlaylist = () => ({
  type: EMPTY_PLAYLIST,
});

export const SET_COVER_DATA = "MUSA/PLAYER/SET_COVER_DATA";
export type SetCoverDataAction = {
  type: typeof SET_COVER_DATA;
  coverData: CoverData;
};
export const setCoverData = (coverData: CoverData) => ({
  type: SET_COVER_DATA,
  coverData,
});

export type PlayerState = {
  items: AudioWithMetadata[];
  currentItem: AudioWithMetadata | Record<string, unknown>;
  currentIndex: number;
  src: string;
  coverUrl: string;
  previousCoverUrl: string;
  isPlaying: boolean;
  coverData: CoverData;
  replay: boolean;
};

const initialState: PlayerState = {
  items: [],
  currentItem: {},
  currentIndex: -1,
  src: "",
  coverUrl: "",
  previousCoverUrl: "",
  isPlaying: false,
  coverData: {
    isCoverLoaded: false,
    scaleDownImage: false,
    maxHeight: 394,
  },
  replay: false,
};

type PlayerAction =
  | PlayAction
  | PlayIndexAction
  | PlayNextAction
  | ReplayAction
  | PauseAction
  | AddToPlaylistAction
  | PasteToPlaylistAction
  | RemoveIndexesFromPlaylistAction
  | EmptyPlaylistAction
  | SetCoverDataAction;

const hasIndex = (
  action: PlayIndexAction | PlayNextAction,
): action is PlayIndexAction => {
  return "index" in action && typeof action.index === "number";
};

const player = (state = initialState, action: PlayerAction) => {
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
      let newIndex;
      if (hasIndex(action)) {
        newIndex = action.index;
      } else {
        newIndex = state.currentIndex + 1;
      }

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
          previousCoverUrl: cleanUrl(state.currentItem.coverUrl),
          coverData: {
            ...state.coverData,
            isCoverLoaded:
              cleanUrl(state.currentItem.coverUrl) ===
              cleanUrl(newItem.coverUrl),
          },
        };
      }
      // We've reached end of playlist.
      // Start it from the beginning.
      return {
        ...initialState,
        items: state.items,
        coverData: {
          ...state.coverData,
          isCoverLoaded: false,
        },
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
        state.items.length,
      );
      const newItems = [...playlistStart, ...action.items, ...playlistEnd];
      let newIndex =
        action.index < state.currentIndex
          ? action.items.length + state.currentIndex
          : state.currentIndex;

      // If there is no new index found after paste assume it's a copy-paste operation
      // where the currently playing index is being copy-pasted and try to find index by item
      if (newIndex < 0) {
        newIndex = newItems.findIndex((item) => item === state.currentItem);
      }

      return getStateByPlaylistChange(state, newItems, newIndex);
    }
    case REMOVE_INDEXES_FROM_PLAYLIST: {
      const newItems = state.items.filter(
        (_, index) => !action.indexes.includes(index),
      );
      const isRemovingCurrentIndex = action.indexes.includes(
        state.currentIndex,
      );
      const indexesBelowCurrentIndex = action.indexes.filter(
        (i) => i < state.currentIndex,
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
    case SET_COVER_DATA: {
      return {
        ...state,
        coverData: {
          ...action.coverData,
        },
      };
    }
    default:
      return state;
  }
};

function getPlayBase(
  newItem: AudioWithMetadata | Record<string, unknown>,
  newIndex: number,
) {
  return {
    currentItem: newItem,
    currentIndex: newIndex,
    isPlaying: true,
    src: cleanUrl(newItem.fileUrl),
    coverUrl: cleanUrl(newItem.coverUrl) || "",
  };
}

function getStateByPlaylistChange(
  state: PlayerState,
  newItems: AudioWithMetadata[],
  currentIndex: number,
) {
  return {
    ...state,
    items: newItems,
    currentIndex,
  };
}

export default player;
