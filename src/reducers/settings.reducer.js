import { FALLBACK_THEME } from "../config";
import { REPLAYGAIN_TYPE } from "../util";

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS";
export const updateSettings = (props) => ({
  type: UPDATE_SETTINGS,
  props,
});

export const VOLUME_DEFAULT = 50;

const initialState = {
  isInit: false,
  currentTheme: FALLBACK_THEME,
  key: "state",
  replaygainType: REPLAYGAIN_TYPE.Album,
  volume: VOLUME_DEFAULT,
  musicLibraryPaths: [],
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      return {
        ...state,
        ...action.props,
      };
    }
    default:
      return state;
  }
};

export default settings;
