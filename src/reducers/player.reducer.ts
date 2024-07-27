import {
  Artist,
  AudioWithMetadata,
  File as MusaFile,
  EnrichedAlbumFile,
} from "@miikaah/musa-core";
import { cleanUrl } from "../util";
import { CoverData } from "../types";

export const PLAY = "MUSA/PLAYER/PLAY" as const;
export const play = () => ({
  type: PLAY,
});

export const PLAY_INDEX = "MUSA/PLAYER/PLAY_INDEX" as const;
export const playIndex = (index: number) => ({
  type: PLAY_INDEX,
  index,
});

export const PLAY_NEXT = "MUSA/PLAYER/PLAY_NEXT" as const;
export const playNext = () => ({
  type: PLAY_NEXT,
});

export const REPLAY = "MUSA/PLAYER/REPLAY" as const;
export const replay = (replay: boolean) => ({
  type: REPLAY,
  replay,
});

export const PAUSE = "MUSA/PLAYER/PAUSE" as const;
export const pause = () => ({
  type: PAUSE,
});

export const ADD_TO_PLAYLIST = "MUSA/PLAYER/ADD" as const;
export const addToPlaylist = (
  item: AudioWithMetadata | EnrichedAlbumFile | Artist["albums"][0],
) => ({
  type: ADD_TO_PLAYLIST,
  item,
});

export const PASTE_TO_PLAYLIST = "MUSA/PLAYER/PASTE_TO_PLAYLIST" as const;
export const pasteToPlaylist = (
  items: AudioWithMetadata[] | EnrichedAlbumFile[] | MusaFile[],
  index?: number,
) => ({
  type: PASTE_TO_PLAYLIST,
  items,
  index,
});

export const PASTE_TO_PLAYLIST_HEAD =
  "MUSA/PLAYER/PASTE_TO_PLAYLIST_HEAD" as const;
export const pasteToPlaylistHead = (
  items: AudioWithMetadata[] | EnrichedAlbumFile[] | MusaFile[],
) => ({
  type: PASTE_TO_PLAYLIST_HEAD,
  items,
});

export const REMOVE_INDEXES_FROM_PLAYLIST =
  "MUSA/PLAYER/REMOVE_INDEXES_FROM_PLAYLIST" as const;
export const removeIndexesFromPlaylist = (indexes: number[]) => ({
  type: REMOVE_INDEXES_FROM_PLAYLIST,
  indexes,
});

export const EMPTY_PLAYLIST = "MUSA/PLAYER/EMPTY_PLAYLIST" as const;
export const emptyPlaylist = () => ({
  type: EMPTY_PLAYLIST,
});

export const SET_COVER_DATA = "MUSA/PLAYER/SET_COVER_DATA" as const;
export const setCoverData = (coverData: CoverData) => ({
  type: SET_COVER_DATA,
  coverData,
});

export type PlayerState = {
  items: AudioWithMetadata[];
  currentItem: AudioWithMetadata | undefined;
  currentIndex: number;
  src: string;
  coverUrl: string;
  previousCoverUrl: string;
  isPlaying: boolean;
  coverData: CoverData;
  replay: boolean;
};

export const initialState: PlayerState = {
  items: [],
  currentItem: undefined,
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
  | ReturnType<typeof play>
  | ReturnType<typeof playIndex>
  | ReturnType<typeof playNext>
  | ReturnType<typeof replay>
  | ReturnType<typeof pause>
  | ReturnType<typeof addToPlaylist>
  | ReturnType<typeof pasteToPlaylist>
  | ReturnType<typeof pasteToPlaylistHead>
  | ReturnType<typeof removeIndexesFromPlaylist>
  | ReturnType<typeof emptyPlaylist>
  | ReturnType<typeof setCoverData>;

const hasIndex = (
  action: ReturnType<typeof playIndex> | ReturnType<typeof playNext>,
): action is ReturnType<typeof playIndex> => {
  return "index" in action && typeof action.index === "number";
};

const player = (state = initialState, action: PlayerAction) => {
  switch (action.type) {
    case PLAY: {
      // * If play is paused and playlist has items resume playback
      // * else take the first song in the playlist
      let newItem, newIndex;

      if (state.currentItem) {
        newItem = state.currentItem;
        newIndex = state.currentIndex;
      } else {
        newItem = state.items[0];
        newIndex = 0;
      }

      if (newItem) {
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
          previousCoverUrl: cleanUrl(state.currentItem?.coverUrl),
          coverData: {
            ...state.coverData,
            isCoverLoaded:
              cleanUrl(state.currentItem?.coverUrl) ===
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
        const newItems = [
          ...state.items,
          ...action.items,
        ] as AudioWithMetadata[];

        return getStateByPlaylistChange(state, newItems, state.currentIndex);
      }

      const playlistStart = state.items.slice(0, action.index + 1);
      const playlistEnd = state.items.slice(
        action.index + 1,
        state.items.length,
      );
      const newItems = [
        ...playlistStart,
        ...action.items,
        ...playlistEnd,
      ] as AudioWithMetadata[];
      let newIndex =
        action.index < state.currentIndex
          ? action.items.length + state.currentIndex
          : state.currentIndex;

      // If the index is -1 playback has not yet begun or it's out of sync.
      // Try to find the index by currentItem.
      if (newIndex < 0) {
        newIndex = newItems.findIndex((item) => item === state.currentItem);
      }

      return getStateByPlaylistChange(state, newItems, newIndex);
    }
    case PASTE_TO_PLAYLIST_HEAD: {
      const newItems = [...action.items, ...state.items] as AudioWithMetadata[];

      return getStateByPlaylistChange(state, newItems, state.currentIndex);
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
      action satisfies never;
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
    coverUrl: cleanUrl(newItem.coverUrl),
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
