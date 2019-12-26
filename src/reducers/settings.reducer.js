import { FALLBACK_THEME } from "../config";
import { REPLAYGAIN_TYPE } from "../util";

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS";
export const updateSettings = props => ({
  type: UPDATE_SETTINGS,
  props
});

export const VOLUME_DEFAULT = 50;

const initialState = {
  currentTheme: FALLBACK_THEME,
  defaultTheme: FALLBACK_THEME,
  key: "state",
  replaygainType: REPLAYGAIN_TYPE.Album,
  volume: VOLUME_DEFAULT,
  musicLibraryPaths: [],
  spotify: {},
  // Has to be separate because Spotify does not always send a new refresh token
  spotifyTokens: {
    access: undefined,
    refresh: undefined
  }
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      return {
        ...state,
        ...action.props
      };
    }
    default:
      return state;
  }
};

export default settings;
