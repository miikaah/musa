export const SET_QUERY = "MUSA/SEARCH/SET_QUERY";
export const setQuery = (query) => ({
  type: SET_QUERY,
  query,
});

export const SET_FILTER = "MUSA/SEARCH/SET_FILTER";
export const setFilter = (filter) => ({
  type: SET_FILTER,
  filter,
});

export const SET_IS_RANDOM = "MUSA/SEARCH/SET_IS_RANDOM";
export const setIsSearchRandom = (isRandom) => ({
  type: SET_IS_RANDOM,
  isRandom,
});

export const SET_IS_SEARCH_TERM_LOCKED =
  "MUSA/SEARCH/SET_IS_SEARCH_TERM_LOCKED";
export const setIsSearchTermLocked = (isSearchTermLocked) => ({
  type: SET_IS_SEARCH_TERM_LOCKED,
  isSearchTermLocked,
});

export const SET_SEARCH_RESULTS = "MUSA/SEARCH/SET_SEARCH_RESULTS";
export const setSearchResults = (result) => ({
  type: SET_SEARCH_RESULTS,
  result,
});

export const CLEAR_SEARCH = "MUSA/SEARCH/CLEAR_SEARCH";
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export const UPDATE_SCROLL_POSITION = "MUSA/SEARCH/UPDATE_SCROLL_POSITION";
export const updateScrollPosition = (props) => ({
  type: UPDATE_SCROLL_POSITION,
  props,
});

const initialState = {
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

const search = (state = initialState, action) => {
  switch (action.type) {
    case SET_QUERY: {
      return {
        ...state,
        query: `${action.query}`,
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
