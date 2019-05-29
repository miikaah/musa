export const TOGGLE = "MUSA/LIBRARY/TOGGLE";
export const toggleLibrary = () => ({
  type: TOGGLE
});

export const HIDE = "MUSA/LIBRARY/HIDE";
export const hideLibrary = () => ({
  type: HIDE
});

export const SET_SCAN_PROPS = "MUSA/LIBRARY/SET_SCAN_PROPS";
export const setScanProps = ({ scanLength, scannedLength, reset }) => ({
  type: SET_SCAN_PROPS,
  scanLength,
  scannedLength,
  reset
});

const initialState = {
  isVisible: true,
  scanLength: -1,
  scannedLength: 0
};

const library = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: {
      return {
        ...state,
        isVisible: !state.isVisible
      };
    }
    case HIDE: {
      return {
        ...state,
        isVisible: false
      };
    }
    case SET_SCAN_PROPS: {
      if (action.reset) {
        return {
          ...state,
          scanLength: initialState.scanLength,
          scannedLength: initialState.scannedLength
        };
      }
      return {
        ...state,
        scanLength: action.scanLength || state.scanLength,
        scannedLength: action.scannedLength || state.scannedLength
      };
    }
    default:
      return state;
  }
};

export default library;
