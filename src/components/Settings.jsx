import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import ThemeLibrary from "./ThemeLibrary";
import ReplaygainSetting from "./ReplaygainSetting";
import MusicLibrarySetting from "./MusicLibrarySetting";
import Button from "./Button";

const SettingsBlock = styled.div`
  margin-bottom: 60px;
`;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Settings = ({ isVisible, musicLibraryPaths }) => {
  const runInitialScan = () => {
    ipcRenderer.send("runInitialScan", musicLibraryPaths);
  };

  return (
    <>
      <h1>Settings</h1>
      <SettingsBlock>
        <h3>Library</h3>
        <MusicLibrarySetting />
      </SettingsBlock>
      <SettingsBlock>
        <h3>Theme</h3>
        <ThemeLibrary update={isVisible} />
      </SettingsBlock>
      <SettingsBlock>
        <h3>Replaygain</h3>
        <ReplaygainSetting />
      </SettingsBlock>
      <SettingsBlock>
        <h3>Advanced</h3>
        <Button onClick={runInitialScan} isPrimary>
          Re-run initial scan
        </Button>
      </SettingsBlock>
    </>
  );
};

export default connect(
  state => ({
    musicLibraryPaths: state.settings.musicLibraryPaths
  }),
  dispatch => ({ dispatch })
)(Settings);
