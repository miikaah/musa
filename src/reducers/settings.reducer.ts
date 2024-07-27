import { Colors } from "@miikaah/musa-core";
import {
  FALLBACK_THEME,
  REPLAYGAIN_TYPE,
  VOLUME_DEFAULT,
  firFileMap,
} from "../config";
import { SupportedLanguages, translate } from "../i18n";
import { ReplaygainType } from "../types";

export const UPDATE_SETTINGS = "MUSA/SETTINGS/UPDATE_SETTINGS" as const;
export const updateSettings = (props: Partial<SettingsState>) => ({
  type: UPDATE_SETTINGS,
  props,
});

export const firFiles = Object.entries(firFileMap).reduce(
  (acc, [name, filename]) => ({
    ...acc,
    [filename]: {
      name,
      makeUpGain: 0,
    },
  }),
  {},
);

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
  language: SupportedLanguages;
  t: any;
};

export type Settings = Omit<SettingsState, "t">;

export const initialState: SettingsState = {
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
  firFiles,
  volume: VOLUME_DEFAULT,
  musicLibraryPath: "",
  language: "en",
  t: translate("en"),
};

type SettingsAction = ReturnType<typeof updateSettings>;

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
