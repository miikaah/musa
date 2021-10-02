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

const scanColor = {
  RED: "#f00",
  YELLOW: "#ff0",
  GREEN: "#0f0",
};

const initialState = {
  listing: [],
  listingWithLabels: [],
  scanLength: -1,
  scannedLength: 0,
  scanColor: scanColor.RED,
  query: "",
  albums: [],
  songs: [],
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
    default:
      return state;
  }
};

export default library;
