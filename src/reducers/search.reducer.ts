import {
  AlbumWithFilesAndMetadata,
  Artist,
  AudioWithMetadata,
} from "@miikaah/musa-core";

export const SET_QUERY = "MUSA/SEARCH/SET_QUERY";
export type SetQueryAction = {
  type: typeof SET_QUERY;
  query: string;
};
export const setQuery = (query: string) => ({
  type: SET_QUERY,
  query,
});

export const SET_FILTER = "MUSA/SEARCH/SET_FILTER";
export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: string;
};
export const setFilter = (filter: string) => ({
  type: SET_FILTER,
  filter,
});

export const SET_IS_RANDOM = "MUSA/SEARCH/SET_IS_RANDOM";
export type SetIsSearchRandomAction = {
  type: typeof SET_IS_RANDOM;
  isRandom: boolean;
};
export const setIsSearchRandom = (isRandom: boolean) => ({
  type: SET_IS_RANDOM,
  isRandom,
});

export const SET_IS_SEARCH_TERM_LOCKED =
  "MUSA/SEARCH/SET_IS_SEARCH_TERM_LOCKED";
export type SetIsSearchTermLockedAction = {
  type: typeof SET_IS_SEARCH_TERM_LOCKED;
  isSearchTermLocked: boolean;
};
export const setIsSearchTermLocked = (isSearchTermLocked: boolean) => ({
  type: SET_IS_SEARCH_TERM_LOCKED,
  isSearchTermLocked,
});

type SearchResult = {
  artists: unknown[];
  albums: unknown[];
  audios: unknown[];
};

export const SET_SEARCH_RESULTS = "MUSA/SEARCH/SET_SEARCH_RESULTS";
export type SetSearchResultsAction = {
  type: typeof SET_SEARCH_RESULTS;
  result: SearchResult;
};
export const setSearchResults = (result: SearchResult) => ({
  type: SET_SEARCH_RESULTS,
  result,
});

export const CLEAR_SEARCH = "MUSA/SEARCH/CLEAR_SEARCH";
export type ClearSearchAction = {
  type: typeof CLEAR_SEARCH;
};
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export type ScrollPos = {
  artists: number;
  albums: number;
  audios: number;
};

export const UPDATE_SCROLL_POSITION = "MUSA/SEARCH/UPDATE_SCROLL_POSITION";
export type UpdateScrollPositionAction = {
  type: typeof UPDATE_SCROLL_POSITION;
  props: ScrollPos;
};
export const updateScrollPosition = (props: Partial<ScrollPos>) => ({
  type: UPDATE_SCROLL_POSITION,
  props,
});

export type SearchState = {
  query: string;
  filter: string;
  isRandom: boolean;
  isSearchTermLocked: boolean;
  searchArtists: Artist[];
  searchAlbums: AlbumWithFilesAndMetadata[];
  searchAudios: AudioWithMetadata[];
  scrollPos: ScrollPos;
};

const initialState: SearchState = {
  query: "",
  filter: "",
  isRandom: false,
  isSearchTermLocked: false,
  searchArtists: [],
  searchAlbums: [],
  searchAudios: [],
  scrollPos: {
    artists: 0,
    albums: 0,
    audios: 0,
  },
};

type SearchAction =
  | SetQueryAction
  | SetFilterAction
  | SetIsSearchRandomAction
  | SetIsSearchTermLockedAction
  | SetSearchResultsAction
  | ClearSearchAction
  | UpdateScrollPositionAction;

const search = (state = initialState, action: SearchAction) => {
  switch (action.type) {
    case SET_QUERY: {
      return {
        ...state,
        query: `${action.query}`,
        isRandom: false,
        isSearchTermLocked: false,
      };
    }
    case SET_FILTER: {
      return {
        ...state,
        filter: action.filter,
      };
    }
    case SET_IS_RANDOM: {
      return {
        ...state,
        isRandom: action.isRandom,
      };
    }
    case SET_IS_SEARCH_TERM_LOCKED: {
      return {
        ...state,
        isSearchTermLocked: action.isSearchTermLocked,
      };
    }
    case SET_SEARCH_RESULTS: {
      return {
        ...state,
        searchArtists: action.result.artists,
        searchAlbums: action.result.albums,
        searchAudios: action.result.audios,
      };
    }
    case CLEAR_SEARCH: {
      return {
        ...state,
        query: "",
        filter: "",
        isRandom: false,
        searchArtists: [],
        searchAlbums: [],
        searchAudios: [],
      };
    }
    case UPDATE_SCROLL_POSITION: {
      return {
        ...state,
        scrollPos: {
          ...state.scrollPos,
          ...action.props,
        },
      };
    }
    default:
      return state;
  }
};

export default search;
