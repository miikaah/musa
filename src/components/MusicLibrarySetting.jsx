import React, { useEffect } from "react";
import { connect } from "react-redux";
import { updateSettings } from "reducers/settings.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from "lodash-es";
import styled from "styled-components/macro";
import { doIdbRequest } from "../util";
import Button from "./Button";

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

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const songListProps = {
  method: "get",
  storeName: "songList",
  key: "list",
};

const MusicLibrarySetting = ({ musicLibraryPaths, dispatch }) => {
  useEffect(() => {
    ipcRenderer.on("addMusicLibraryPath", (event, path) => {
      dispatch(
        updateSettings({
          musicLibraryPaths: Array.from(new Set([...musicLibraryPaths, path])),
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicLibraryPaths]);

  const removeLibraryPath = (path) => {
    const paths = new Set(musicLibraryPaths);
    paths.delete(path);
    const libPaths = Array.from(paths);
    dispatch(updateSettings({ musicLibraryPaths: libPaths }));
    doIdbRequest({
      ...songListProps,
      onReqSuccess: (req) => () => {
        ipcRenderer.send(
          "removeMusicLibraryPath",
          get(req, "result.list"),
          libPaths,
          path
        );
      },
    });
  };

  const addLibraryPath = () => {
    doIdbRequest({
      ...songListProps,
      onReqSuccess: (req) => () => {
        ipcRenderer.send(
          "addMusicLibraryPath",
          get(req, "result.list"),
          musicLibraryPaths
        );
      },
    });
  };

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
