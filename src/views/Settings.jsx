import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import ThemeLibrary from "components/ThemeLibrary";
import ReplaygainSetting from "components/ReplaygainSetting";
import PreAmpSetting from "components/PreAmpSetting";
import UseFirSetting from "components/UseFirSetting";
import MusicLibrarySetting from "components/MusicLibrarySetting";
import Button from "components/Button";
import BasePage from "components/BasePage";
import config from "config";
import Api from "api-client";

const { isElectron } = config;

const FirstRow = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  grid-column-gap: 40px;
  margin-bottom: 20px;
`;

const SettingsBlock = styled.div`
  margin-bottom: 20px;
`;

const ExperimentalContainer = styled.div`
  display: flex;

  > div {
    margin-right: 20px;
  }
`;

const ActionButton = styled(Button)`
  max-width: 200px;
`;

const Settings = ({ musicLibraryPath, currentProfile }) => {
  const [themes, setThemes] = useState([]);
  const [hasFetchedThemes, setHasFetchedThemes] = useState(false);

  useEffect(() => {
    Api.getThemes()
      .then(setThemes)
      .then(() => setHasFetchedThemes(true))
      .catch(() => setHasFetchedThemes(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runInitialScan = () => {
    Api.refreshLibrary();
  };

  if (!hasFetchedThemes) {
    return <BasePage></BasePage>;
  }

  const getThemesBlock = () => (
    <>
      {!isElectron && currentProfile && (
        <SettingsBlock>
          <h3>Profile</h3>
          <p>{currentProfile}</p>
        </SettingsBlock>
      )}
      <SettingsBlock>
        <h3>Theme</h3>
        <ThemeLibrary themes={themes} setThemes={setThemes} />
      </SettingsBlock>
    </>
  );

  return (
    <BasePage>
      {isElectron && (
        <div>
          {
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
          }
          {musicLibraryPath && getThemesBlock()}
        </div>
      )}
      {!isElectron && (
        <>
          {getThemesBlock()}
          <SettingsBlock>
            <h3>Replaygain</h3>
            <ReplaygainSetting />
          </SettingsBlock>
        </>
      )}
      <h3>Experimental</h3>
      <ExperimentalContainer>
        <SettingsBlock>
          <PreAmpSetting />
        </SettingsBlock>
        <SettingsBlock>
          <UseFirSetting />
        </SettingsBlock>
      </ExperimentalContainer>
    </BasePage>
  );
};

export default connect(
  (state) => ({
    musicLibraryPath: state.settings.musicLibraryPath,
    currentProfile: state.profile.currentProfile,
  }),
  (dispatch) => ({ dispatch })
)(Settings);
