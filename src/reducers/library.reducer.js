export const SET_LISTING = "MUSA/LIBRARY/SET_LISTING"
export const setListing = listing => ({
  type: SET_LISTING,
  listing
})

export const SET_SCAN_PROPS = "MUSA/LIBRARY/SET_SCAN_PROPS"
export const setScanProps = ({ scanLength, scannedLength, reset }) => ({
  type: SET_SCAN_PROPS,
  scanLength,
  scannedLength,
  reset
})

const initialState = {
  listing: [],
  scanLength: -1,
  scannedLength: 0
}

const library = (state = initialState, action) => {
  switch (action.type) {
    case SET_LISTING: {
      return {
        ...state,
        listing: action.listing
      }
    }
    case SET_SCAN_PROPS: {
      if (action.reset) {
        return {
          ...state,
          scanLength: initialState.scanLength,
          scannedLength: initialState.scannedLength
        }
      }
      return {
        ...state,
        scanLength: action.scanLength || state.scanLength,
        scannedLength: action.scannedLength || state.scannedLength
      }
    }
    default:
      return state
  }
}

export default library
