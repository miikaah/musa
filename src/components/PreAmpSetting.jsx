import React, { useState } from "react";
import { connect } from "react-redux";
import { updateSettings } from "reducers/settings.reducer";

const PreAmpSetting = ({ isInit, preAmpDb, dispatch }) => {
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
      <h5>Pre-amp dB</h5>
      <input
        placeholder="db"
        step="1"
        min="0"
        max="100"
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
    preAmpDb: state.settings.preAmpDb,
  }),
  (dispatch) => ({ dispatch })
)(PreAmpSetting);
