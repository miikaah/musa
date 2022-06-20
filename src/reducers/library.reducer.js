export const SET_LISTING_WITH_LABELS = "MUSA/LIBRARY/SET_LISTING_WITH_LABELS";
export const setListingWithLabels = (listingWithLabels) => ({
  type: SET_LISTING_WITH_LABELS,
  listingWithLabels,
});

export const SET_SCAN_PROPS = "MUSA/LIBRARY/SET_SCAN_PROPS";
export const setScanProps = ({
  scanLength,
  scannedLength,
  scanColor,
  reset,
}) => ({
  type: SET_SCAN_PROPS,
  scanLength,
  scannedLength,
  scanColor,
  reset,
});

export const SET_QUERY = "MUSA/LIBRARY/SET_QUERY";
export const setQuery = (query) => ({
  type: SET_QUERY,
  query,
});

export const SET_FILTER = "MUSA/LIBRARY/SET_FILTER";
export const setFilter = (filter) => ({
  type: SET_FILTER,
  filter,
});

export const SET_SEARCH_RESULTS = "MUSA/LIBRARY/SET_SEARCH_RESULTS";
export const setSearchResults = (result) => ({
  type: SET_SEARCH_RESULTS,
  result,
});

const scanColor = {
  RED: "#f00",
  YELLOW: "#ff0",
  GREEN: "#0f0",
};

const initialState = {
  listingWithLabels: [],
  scanLength: -1,
  scannedLength: 0,
  scanColor: scanColor.RED,
  query: "",
  filter: "",
  searchArtists: [],
  searchAlbums: [],
  searchAudios: [],
};

const library = (state = initialState, action) => {
  switch (action.type) {
    case SET_LISTING_WITH_LABELS: {
      return {
        ...state,
        listingWithLabels: action.listingWithLabels,
      };
    }
    case SET_SCAN_PROPS: {
      if (action.reset) {
        return {
          ...state,
          scanLength: initialState.scanLength,
          scannedLength: initialState.scannedLength,
        };
      }
      return {
        ...state,
        scanLength: action.scanLength || state.scanLength,
        scannedLength: action.scannedLength || state.scannedLength,
        scanColor: action.scanColor || state.scanColor,
      };
    }
    case SET_QUERY: {
      return {
        ...state,
        query: action.query,
      };
    }
    case SET_FILTER: {
      return {
        ...state,
        filter: action.filter,
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
    default:
      return state;
  }
};

export default library;
