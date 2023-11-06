import React from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import Button from "../Button";
import Api from "../../apiClient";
import { TranslateFn } from "../../i18n";

const Container = styled.div``;

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

type MusicLibrarySettingProps = {
  musicLibraryPath?: string;
  t: TranslateFn;
};

const MusicLibrarySetting = ({
  musicLibraryPath,
  t,
}: MusicLibrarySettingProps) => {
  const dispatch = useDispatch();

  const removeLibraryPath = () => {
    dispatch(
      updateSettings({
        musicLibraryPath: "",
      }),
    );
  };

  const addLibraryPath = () => {
    Api.addMusicLibraryPath().then((path) => {
      dispatch(
        updateSettings({
          musicLibraryPath: path,
        }),
      );
    });
  };

  return (
    <Container>
      <MusicLibrarySettingPath>
        <input disabled readOnly value={musicLibraryPath} />
        <Button
          onClick={removeLibraryPath}
          isSecondary
          disabled={!musicLibraryPath}
          data-testid="MusicLibrarySettingRemoveButton"
        >
          <FontAwesomeIcon icon="trash" />
        </Button>
      </MusicLibrarySettingPath>
      <Button
        onClick={addLibraryPath}
        isPrimary
        disabled={Boolean(musicLibraryPath)}
      >
        {t("settings.library.addNew")}
      </Button>
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  musicLibraryPath: state.settings.musicLibraryPath,
  t: state.settings.t,
}))(MusicLibrarySetting);
