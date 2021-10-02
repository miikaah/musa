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

const MusicLibrarySetting = ({ musicLibraryPath, dispatch }) => {
  useEffect(() => {
    if (ipc) {
      ipc.once("musa:addMusicLibraryPath:response", (event, path) => {
        dispatch(
          updateSettings({
            musicLibraryPath: path,
          })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicLibraryPath]);

  const removeLibraryPath = () => {
    dispatch(
      updateSettings({
        musicLibraryPath: "",
      })
    );
  };

  const addLibraryPath = () => {
    ipc.send("musa:addMusicLibraryPath:request");
  };

  return (
    <MusicLibrarySettingContainer>
      <h5>Path</h5>
      <MusicLibrarySettingPath>
        <input disabled readOnly value={musicLibraryPath} />
        <Button
          onClick={removeLibraryPath}
          isSecondary
          disabled={!musicLibraryPath}
        >
          <FontAwesomeIcon icon="trash" />
        </Button>
      </MusicLibrarySettingPath>
      <Button onClick={addLibraryPath} isPrimary disabled={musicLibraryPath}>
        Add new
      </Button>
    </MusicLibrarySettingContainer>
  );
};

export default connect(
  (state) => ({
    musicLibraryPath: state.settings.musicLibraryPath,
  }),
  (dispatch) => ({ dispatch })
)(MusicLibrarySetting);
