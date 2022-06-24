import { FALLBACK_THEME, firFileMap } from "config";
import { REPLAYGAIN_TYPE } from "../util";

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS";
export const updateSettings = (props) => ({
  type: UPDATE_SETTINGS,
  props,
});

export const VOLUME_DEFAULT = 50;

const initialState = {
  isInit: false,
  currentTheme: {
    colors: FALLBACK_THEME,
  },
  key: "state",
  replaygainType: REPLAYGAIN_TYPE.Album,
  preAmpDb: 0,
  firMakeUpGainDb: 0,
  firFile: "",
  firFiles: Object.entries(firFileMap).reduce(
    (acc, [name, filename]) => ({
      ...acc,
      [filename]: {
        name,
        makeUpGain: 0,
      },
    }),
    {}
  ),
  volume: VOLUME_DEFAULT,
  musicLibraryPath: "",
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
