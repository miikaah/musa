import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { updateSettings } from "../reducers/settings.reducer";

const Input = styled.input`
  max-width: 104px;
`;

const PreAmpSetting = ({ isInit, preAmpDb, t, dispatch }) => {
  const [value, setValue] = useState(preAmpDb || 0);

  if (!isInit) {
    return null;
  }

  const updateState = (event) => {
    setValue(event.target.value);
    dispatch(updateSettings({ preAmpDb: event.target.value }));
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
      />
    </>
  );
};

export default connect(
  (state) => ({
    isInit: state.settings.isInit,
    t: state.settings.t,
    preAmpDb: state.settings.preAmpDb,
  }),
  (dispatch) => ({ dispatch }),
)(PreAmpSetting);
