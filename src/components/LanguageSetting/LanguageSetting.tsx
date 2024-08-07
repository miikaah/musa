import React from "react";
import { connect, useDispatch } from "react-redux";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import { SupportedLanguages, TranslateFn, languages } from "../../i18n/i18n";
import SettingSelect from "../SettingSelect";

type LanguageSettingProps = {
  language: SettingsState["language"];
  t: TranslateFn;
};

const LanguageSetting = ({ language, t }: LanguageSettingProps) => {
  const dispatch = useDispatch();

  const updateState = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateSettings({ language: event.target.value as SupportedLanguages }),
    );
  };

  return (
    <SettingSelect>
      <select
        value={language}
        onChange={updateState}
        data-testid="LanguageSettingSelect"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {t(`settings.language.${lang}`)}
          </option>
        ))}
      </select>
    </SettingSelect>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  language: state.settings.language,
  t: state.settings.t,
}))(LanguageSetting);
