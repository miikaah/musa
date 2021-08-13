import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import styled from "styled-components/macro";
import { REPLAYGAIN_TYPE, getStateFromIdb, updateStateInIdb } from "../util";
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

const ReplaygainSetting = ({ replaygainType, dispatch }) => {
  const [type, setType] = useState();
  const [reqIdb, setReq] = useState();
  const [dbIdb, setDb] = useState();

  useEffect(() => {
    getStateFromIdb((req, db) => () => {
      setType(get(req, "result.replaygainType", REPLAYGAIN_TYPE.Track));
      setReq(req);
      setDb(db);
    });
  }, []);

  const updateState = (event) => {
    setType(event.target.value);
    dispatch(updateSettings({ replaygainType: event.target.value }));
    updateStateInIdb(reqIdb, dbIdb, { replaygainType: event.target.value });
  };

  return (
    <ReplaygainSettingSelect>
      <select value={type} onChange={updateState}>
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
  }),
  (dispatch) => ({ dispatch })
)(ReplaygainSetting);
