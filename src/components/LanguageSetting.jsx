import React from "react";
import { connect } from "react-redux";
import { updateSettings } from "../reducers/settings.reducer";
import { languages } from "../i18n/i18n";
import SettingSelect from "./SettingSelect";

const LanguageSetting = ({ language, t, dispatch }) => {
  const updateState = (event) => {
    dispatch(updateSettings({ language: event.target.value }));
  };

  return (
    <SettingSelect>
      <select value={language} onChange={updateState}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {t(`settings.language.${lang}`)}
          </option>
        ))}
      </select>
    </SettingSelect>
  );
};

export default connect(
  (state) => ({
    language: state.settings.language,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(LanguageSetting);
