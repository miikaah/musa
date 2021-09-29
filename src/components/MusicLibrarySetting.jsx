import React, { useEffect } from "react";
import { connect } from "react-redux";
import { updateSettings } from "reducers/settings.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";
import Button from "./Button";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const MusicLibrarySettingContainer = styled.div``;

const MusicLibrarySettingPath = styled.div`
  display: flex;
  margin-bottom: 10px;

  input {
    flex: 90%;
  }

  button {
    flex: 10%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const MusicLibrarySetting = ({ musicLibraryPaths, dispatch }) => {
  // TODO: implement
  useEffect(() => {
    ipc.once("musa:addMusicLibraryPath:response", (event, path) => {
      dispatch(
        updateSettings({
          musicLibraryPaths: Array.from(new Set([...musicLibraryPaths, path])),
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicLibraryPaths]);

  const removeLibraryPath = (path) => {};

  const addLibraryPath = () => {};

  return (
    <MusicLibrarySettingContainer>
      <h5>Paths</h5>
      {musicLibraryPaths.map((path, i) => (
        <MusicLibrarySettingPath key={i}>
          <input disabled readOnly value={path} />
          <Button onClick={() => removeLibraryPath(path)} isSecondary>
            <FontAwesomeIcon icon="trash" />
          </Button>
        </MusicLibrarySettingPath>
      ))}
      <Button onClick={addLibraryPath} isPrimary>
        Add new
      </Button>
    </MusicLibrarySettingContainer>
  );
};

export default connect(
  (state) => ({
    musicLibraryPaths: state.settings.musicLibraryPaths,
  }),
  (dispatch) => ({ dispatch })
)(MusicLibrarySetting);
