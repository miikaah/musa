import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { REPLAYGAIN_TYPE } from "../util";
import { updateSettings } from "reducers/settings.reducer";

const ReplaygainSettingSelect = styled.div`
  position: relative;

  select {
    appearance: none;
    width: 200px;
    padding: 10px;
    font-size: var(--font-size-sm);
    border-radius: 0;
    background-color: var(--color-primary-highlight);
    color: var(--color-typography-primary);
    cursor: pointer;
    border-color: transparent;
  }
`;

const ArrowDown = styled.span`
  position: absolute;
  cursor: pointer;
  width: 0;
  height: 0;
  left: 170px;
  top: 15px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--color-typography-primary);
  pointer-events: none;
`;

const ReplaygainSetting = ({ replaygainType, isInit, dispatch }) => {
  if (!isInit) {
    return null;
  }

  const updateState = (event) => {
    dispatch(updateSettings({ replaygainType: event.target.value }));
  };

  return (
    <ReplaygainSettingSelect>
      <select value={replaygainType} onChange={updateState}>
        <option value={REPLAYGAIN_TYPE.Track}>Track</option>
        <option value={REPLAYGAIN_TYPE.Album}>Album</option>
        <option value={REPLAYGAIN_TYPE.Off}>Off</option>
      </select>
      <ArrowDown />
    </ReplaygainSettingSelect>
  );
};

export default connect(
  (state) => ({
    replaygainType: state.settings.replaygainType,
    isInit: state.settings.isInit,
  }),
  (dispatch) => ({ dispatch })
)(ReplaygainSetting);
