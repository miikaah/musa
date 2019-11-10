import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import styled from "styled-components/macro";
import ThemeLibrary from "components/ThemeLibrary";
import ReplaygainSetting from "components/ReplaygainSetting";
import MusicLibrarySetting from "components/MusicLibrarySetting";
import Button from "components/Button";
import BasePage from "components/BasePage";

const SettingsBlock = styled.div`
  margin-bottom: 60px;
`;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Settings = ({ musicLibraryPaths }) => {
  const runInitialScan = () => {
    ipcRenderer.send("runInitialScan", musicLibraryPaths);
  };

  return (
    <BasePage>
      <h1>Settings</h1>
      <SettingsBlock>
        <h3>Library</h3>
        <MusicLibrarySetting />
      </SettingsBlock>
      <SettingsBlock>
        <h3>Theme</h3>
        <ThemeLibrary />
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
    </BasePage>
  );
};

export default withRouter(
  connect(
    state => ({
      musicLibraryPaths: state.settings.musicLibraryPaths
    }),
    dispatch => ({ dispatch })
  )(Settings)
);
