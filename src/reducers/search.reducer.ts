import {
  AlbumWithFilesAndMetadata,
  ArtistWithEnrichedAlbums,
  AudioWithMetadata,
} from "@miikaah/musa-core";

export const SET_QUERY = "MUSA/SEARCH/SET_QUERY" as const;
export const setQuery = (query: string) => ({
  type: SET_QUERY,
  query,
});

export const SET_FILTER = "MUSA/SEARCH/SET_FILTER" as const;
export const setFilter = (filter: string) => ({
  type: SET_FILTER,
  filter,
});

export const SET_IS_RANDOM = "MUSA/SEARCH/SET_IS_RANDOM" as const;
export const setIsSearchRandom = (isRandom: boolean) => ({
  type: SET_IS_RANDOM,
  isRandom,
});

export const SET_IS_SEARCH_TERM_LOCKED =
  "MUSA/SEARCH/SET_IS_SEARCH_TERM_LOCKED" as const;
export const setIsSearchTermLocked = (isSearchTermLocked: boolean) => ({
  type: SET_IS_SEARCH_TERM_LOCKED,
  isSearchTermLocked,
});

export const SET_SEARCH_RESULTS = "MUSA/SEARCH/SET_SEARCH_RESULTS" as const;
export const setSearchResults = (result: {
  artists: ArtistWithEnrichedAlbums[];
  albums: AlbumWithFilesAndMetadata[];
  audios: AudioWithMetadata[];
}) => ({
  type: SET_SEARCH_RESULTS,
  result,
});

export const CLEAR_SEARCH = "MUSA/SEARCH/CLEAR_SEARCH" as const;
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export type ScrollPos = {
  artists: number;
  albums: number;
  audios: number;
};

export const UPDATE_SCROLL_POSITION =
  "MUSA/SEARCH/UPDATE_SCROLL_POSITION" as const;
export const updateScrollPosition = (props: Partial<ScrollPos>) => ({
  type: UPDATE_SCROLL_POSITION,
  props,
});

export type SearchState = {
  query: string;
  filter: string;
  isRandom: boolean;
  isSearchTermLocked: boolean;
  searchArtists: ArtistWithEnrichedAlbums[];
  searchAlbums: AlbumWithFilesAndMetadata[];
  searchAudios: AudioWithMetadata[];
  scrollPos: ScrollPos;
};

export const initialState: SearchState = {
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
  | ReturnType<typeof setQuery>
  | ReturnType<typeof setFilter>
  | ReturnType<typeof setIsSearchRandom>
  | ReturnType<typeof setIsSearchTermLocked>
  | ReturnType<typeof setSearchResults>
  | ReturnType<typeof clearSearch>
  | ReturnType<typeof updateScrollPosition>;

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
