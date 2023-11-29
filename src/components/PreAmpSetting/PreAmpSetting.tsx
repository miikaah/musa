import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";

const Input = styled.input`
  max-width: 104px;
`;

type PreAmpSettingProps = {
  isInit: SettingsState["isInit"];
  preAmpDb: number;
  t: TranslateFn;
};

const PreAmpSetting = ({ isInit, preAmpDb, t }: PreAmpSettingProps) => {
  const [value, setValue] = useState(preAmpDb || 0);
  const dispatch = useDispatch();

  if (!isInit) {
    return null;
  }

  const updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(event.target.value);
    setValue(num);
    dispatch(updateSettings({ preAmpDb: num }));
  };

  return (
    <>
      <h5>{t("settings.experimental.preAmp")} dB</h5>
      <Input
        placeholder="db"
        step="1"
        min="0"
        max="12"
        type="number"
        value={value}
        onChange={updateState}
        data-testid="PreAmpSettingInput"
      />
    </>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  isInit: state.settings.isInit,
  t: state.settings.t,
  preAmpDb: state.settings.preAmpDb,
}))(PreAmpSetting);
