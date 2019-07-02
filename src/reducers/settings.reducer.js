import { FALLBACK_THEME } from "../config"
import { REPLAYGAIN_TYPE, getStateFromIdb, updateStateInIdb } from "../util"

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS"
export const updateSettings = props => ({
  type: UPDATE_SETTINGS,
  props
})

export const VOLUME_DEFAULT = 50

const initialState = {
  currentTheme: FALLBACK_THEME,
  defaultTheme: FALLBACK_THEME,
  key: "state",
  replaygainType: REPLAYGAIN_TYPE.Track,
  volume: VOLUME_DEFAULT,
  musicLibraryPaths: []
}

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const newState = {
        ...state,
        ...action.props
      }
      getStateFromIdb((req, db) => () => updateStateInIdb(req, db, newState))
      return newState
    }
    default:
      return state
  }
}

export default settings
