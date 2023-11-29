import React from "react";
import { connect, useDispatch } from "react-redux";
import { REPLAYGAIN_TYPE } from "../../config";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import SettingSelect from "../SettingSelect";
import { ReplaygainType } from "../../types";
import { TranslateFn } from "../../i18n";

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

type ReplaygainSettingProps = {
  replaygainType: ReplaygainType;
  t: TranslateFn;
};

const ReplaygainSetting = ({ replaygainType, t }: ReplaygainSettingProps) => {
  const dispatch = useDispatch();

  const updateState = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateSettings({ replaygainType: getReplaygainType(event.target.value) }),
    );
  };

  return (
    <SettingSelect>
      <select
        value={replaygainType}
        onChange={updateState}
        data-testid="ReplaygainSettingSelect"
      >
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

export default connect((state: { settings: SettingsState }) => ({
  replaygainType: state.settings.replaygainType,
  t: state.settings.t,
}))(ReplaygainSetting);
