import { flatten, get, isUndefined } from "lodash-es"

export const INIT_LISTING = "MUSA/LIBRARY/INIT_LISTING"
export const initListing = listing => ({
  type: INIT_LISTING,
  listing
})

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

export const SET_QUERY = "MUSA/LIBRARY/SET_QUERY"
export const setQuery = query => ({
  type: SET_QUERY,
  query
})

const initialState = {
  listing: [],
  scanLength: -1,
  scannedLength: 0,
  query: "",
  albums: [],
  songs: []
}

const library = (state = initialState, action) => {
  switch (action.type) {
    case INIT_LISTING: {
      const albums = getAlbums(action.listing)
      const songs = getSongs(albums)
      return {
        ...state,
        listing: action.listing,
        albums,
        songs
      }
    }
    case SET_LISTING: {
      return {
        ...state,
        listing: action.listing
      }
    }
    case SET_SCAN_PROPS: {
      if (action.reset) {
        const albums = getAlbums(state.listing)
        const songs = getSongs(albums)
        return {
          ...state,
          scanLength: initialState.scanLength,
          scannedLength: initialState.scannedLength,
          albums,
          songs
        }
      }
      return {
        ...state,
        scanLength: action.scanLength || state.scanLength,
        scannedLength: action.scannedLength || state.scannedLength
      }
    }
    case SET_QUERY: {
      return {
        ...state,
        query: action.query
      }
    }
    default:
      return state
  }
}

function getAlbums(listing) {
  return flatten(
    listing.map(l =>
      l.albums.map(a => ({
        ...a,
        artist: l.name
      }))
    )
  )
}

function getSongs(albums) {
  return flatten(
    albums.map(a =>
      a.songs.map(s => ({
        name: get(s, "metadata.title", ""),
        path: s.path,
        cover: isUndefined(a.cover) ? "" : a.cover,
        metadata: s.metadata
      }))
    )
  )
}

export default library
