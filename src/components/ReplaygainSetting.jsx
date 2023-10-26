import React from "react";
import { connect } from "react-redux";
import { REPLAYGAIN_TYPE } from "../util";
import { updateSettings } from "../reducers/settings.reducer";
import SettingSelect from "./SettingSelect";

const ReplaygainSetting = ({ replaygainType, t, dispatch }) => {
  const updateState = (event) => {
    dispatch(updateSettings({ replaygainType: event.target.value }));
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
  (state) => ({
    replaygainType: state.settings.replaygainType,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(ReplaygainSetting);
