import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { REPLAYGAIN_TYPE, getStateFromIdb, updateStateInIdb } from "../util";
import { updateSettings } from "reducers/settings.reducer";
import { get } from "lodash-es";
import "./ReplaygainSetting.scss";

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

  const updateState = event => {
    setType(event.target.value);
    dispatch(updateSettings({ replaygainType: event.target.value }));
    updateStateInIdb(reqIdb, dbIdb, { replaygainType: event.target.value });
  };

  return (
    <div className="replaygain-setting">
      <select value={type} onChange={updateState}>
        <option value={REPLAYGAIN_TYPE.Track}>Track</option>
        <option value={REPLAYGAIN_TYPE.Album}>Album</option>
        <option value={REPLAYGAIN_TYPE.Off}>Off</option>
      </select>
      <span className="arrow-down" />
    </div>
  );
};

export default connect(
  state => ({
    replaygainType: state.settings.replaygainType
  }),
  dispatch => ({ dispatch })
)(ReplaygainSetting);
