import { Colors } from "@miikaah/musa-core";
import { FALLBACK_THEME, firFileMap } from "../config";
import { REPLAYGAIN_TYPE } from "../util";
import { translate } from "../i18n";
import { ReplaygainType } from "../types";

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS";
export type UpdateSettingsAction = {
  type: typeof UPDATE_SETTINGS;
  props: Partial<SettingsState>;
};
export const updateSettings = (props: Partial<SettingsState>) => ({
  type: UPDATE_SETTINGS,
  props,
});

export const VOLUME_DEFAULT = 50;

export type SettingsState = {
  isInit: boolean | null;
  currentTheme: {
    colors: Colors;
    filename: string;
    id: string;
  };
  currentProfile?: string; // Only on server
  key?: string;
  replaygainType: ReplaygainType;
  preAmpDb: number;
  firMakeUpGainDb: number;
  firFile: string;
  firFiles: Record<string, { name: string; makeUpGain: number }>;
  volume: number;
  musicLibraryPath?: string;
  language: string;
  t: any;
};

export type Settings = Omit<SettingsState, "t">;

const initialState: SettingsState = {
  isInit: false,
  currentTheme: {
    colors: FALLBACK_THEME,
    filename: "",
    id: "",
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
    {},
  ),
  volume: VOLUME_DEFAULT,
  musicLibraryPath: "",
  language: "en",
  t: translate("en"),
};

type SettingsAction = UpdateSettingsAction;

const settings = (state = initialState, action: SettingsAction) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      if (action.props.language) {
        return {
          ...state,
          ...action.props,
          t: translate(action.props.language),
        };
      }

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
