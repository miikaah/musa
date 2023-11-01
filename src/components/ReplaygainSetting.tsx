import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { REPLAYGAIN_TYPE } from "../util";
import { SettingsState, updateSettings } from "../reducers/settings.reducer";
import SettingSelect from "./SettingSelect";
import { ReplaygainType } from "../types";
import { TranslateFn } from "../i18n";

type ReplaygainSettingProps = {
  replaygainType: ReplaygainType;
  t: TranslateFn;
  dispatch: Dispatch;
};

const getReplaygainType = (value: string): ReplaygainType => {
  switch (value) {
    case "track": {
      return "track";
    }
    case "album": {
      return "album";
    }
    case "off": {
      return "off";
    }
    default: {
      throw new Error("Invalid ReplayGain type");
    }
  }
};

const ReplaygainSetting = ({
  replaygainType,
  t,
  dispatch,
}: ReplaygainSettingProps) => {
  const updateState = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateSettings({ replaygainType: getReplaygainType(event.target.value) }),
    );
  };

  return (
    <SettingSelect>
      <select value={replaygainType} onChange={updateState}>
        <option value={REPLAYGAIN_TYPE.Track}>
          {t("settings.advanced.normalization.track")}
        </option>
        <option value={REPLAYGAIN_TYPE.Album}>
          {t("settings.advanced.normalization.album")}
        </option>
        <option value={REPLAYGAIN_TYPE.Off}>
          {t("settings.advanced.normalization.off")}
        </option>
      </select>
    </SettingSelect>
  );
};

export default connect(
  (state: { settings: SettingsState }) => ({
    replaygainType: state.settings.replaygainType,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(ReplaygainSetting);
