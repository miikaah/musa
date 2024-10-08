import { Theme } from "@miikaah/musa-core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import ThemeLibrary from "../components/ThemeLibrary";
import ReplaygainSetting from "../components/ReplaygainSetting";
import PreAmpSetting from "../components/PreAmpSetting";
import UseFirSetting from "../components/UseFirSetting";
import MusicLibrarySetting from "../components/MusicLibrarySetting";
import Button from "../components/Button";
import BasePage from "../components/BasePage";
import LanguageSetting from "../components/LanguageSetting";
import { isElectron } from "../config";
import * as Api from "../apiClient";
import { SettingsState } from "../reducers/settings.reducer";
import { ProfileState } from "../reducers/profile.reducer";
import { TranslateFn } from "../i18n";

const FirstRow = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  grid-column-gap: 40px;
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
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

type SettingsProps = {
  musicLibraryPath: SettingsState["musicLibraryPath"];
  currentProfile: ProfileState["currentProfile"];
  t: TranslateFn;
};

const Settings = ({ musicLibraryPath, currentProfile, t }: SettingsProps) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [hasFetchedThemes, setHasFetchedThemes] = useState(false);

  useEffect(() => {
    Api.getThemes()
      .then(setThemes)
      .then(() => setHasFetchedThemes(true))
      .catch(() => setHasFetchedThemes(true));
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
          <h3>{t("settings.profile.title")}</h3>
          <p>{currentProfile}</p>
        </SettingsBlock>
      )}
      <SettingsBlock>
        <h3>{t("settings.theme.title")}</h3>
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
                <h3>{t("settings.library.title")}</h3>
                <h5>{t("settings.library.path")}</h5>
                <MusicLibrarySetting />
              </SettingsBlock>
              <div>
                <SettingsBlock>
                  <h3>{t("settings.advanced.title")}</h3>
                  <h5>{t("settings.advanced.normalization")}</h5>
                  <ReplaygainSetting />
                </SettingsBlock>
                <SettingsBlock>
                  <h5>{t("settings.advanced.actions")}</h5>
                  <ActionButton onClick={runInitialScan} isPrimary>
                    {t("settings.advanced.updateLibrary")}
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
            <h3>{t("settings.advanced.normalization")}</h3>
            <ReplaygainSetting />
          </SettingsBlock>
        </>
      )}
      <h3>{t("settings.experimental.title")}</h3>
      <ExperimentalContainer>
        <SettingsBlock>
          <PreAmpSetting />
        </SettingsBlock>
        <SettingsBlock>
          <UseFirSetting />
        </SettingsBlock>
      </ExperimentalContainer>
      <h3>{t("settings.language.title")}</h3>
      <SettingsBlock>
        <LanguageSetting />
      </SettingsBlock>
    </BasePage>
  );
};

export default connect(
  (state: { settings: SettingsState; profile: ProfileState }) => ({
    musicLibraryPath: state.settings.musicLibraryPath,
    t: state.settings.t,
    currentProfile: state.profile.currentProfile,
  }),
  (dispatch) => ({ dispatch }),
)(Settings);
