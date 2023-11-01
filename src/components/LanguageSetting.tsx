import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { SettingsState, updateSettings } from "../reducers/settings.reducer";
import { TranslateFn, languages } from "../i18n/i18n";
import SettingSelect from "./SettingSelect";

type LanguageSettingProps = {
  language: SettingsState["language"];
  t: TranslateFn;
  dispatch: Dispatch;
};

const LanguageSetting = ({ language, t, dispatch }: LanguageSettingProps) => {
  const updateState = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
  (state: { settings: SettingsState }) => ({
    language: state.settings.language,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(LanguageSetting);
