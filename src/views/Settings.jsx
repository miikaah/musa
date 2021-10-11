import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import styled from "styled-components/macro";
import ThemeLibrary from "components/ThemeLibrary";
import ReplaygainSetting from "components/ReplaygainSetting";
import MusicLibrarySetting from "components/MusicLibrarySetting";
import Button from "components/Button";
import BasePage from "components/BasePage";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const FirstRow = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  grid-column-gap: 40px;
  margin-bottom: 20px;
`;

const SettingsBlock = styled.div`
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  max-width: 200px;
`;

const Settings = ({ musicLibraryPath }) => {
  const runInitialScan = () => {
    if (ipc) {
      ipc.send("musa:scan");
    }
  };

  return (
    <BasePage>
      {isElectron && (
        <div>
          {isElectron && (
            <FirstRow>
              <SettingsBlock>
                <h3>Library</h3>
                <h5>Path</h5>
                <MusicLibrarySetting />
              </SettingsBlock>
              <div>
                <SettingsBlock>
                  <h3>Advanced</h3>
                  <h5>Replaygain</h5>
                  <ReplaygainSetting />
                </SettingsBlock>
                <SettingsBlock>
                  <h5>Actions</h5>
                  <ActionButton onClick={runInitialScan} isPrimary>
                    Update library
                  </ActionButton>
                </SettingsBlock>
              </div>
            </FirstRow>
          )}
          {isElectron && musicLibraryPath && (
            <>
              <SettingsBlock>
                <h3>Theme</h3>
                <ThemeLibrary />
              </SettingsBlock>
            </>
          )}
        </div>
      )}
      {!isElectron && (
        <>
          <SettingsBlock>
            <h3>Theme</h3>
            <ThemeLibrary />
          </SettingsBlock>
          <SettingsBlock>
            <h3>Replaygain</h3>
            <ReplaygainSetting />
          </SettingsBlock>
        </>
      )}
    </BasePage>
  );
};

export default withRouter(
  connect(
    (state) => ({
      musicLibraryPath: state.settings.musicLibraryPath,
    }),
    (dispatch) => ({ dispatch })
  )(Settings)
);
