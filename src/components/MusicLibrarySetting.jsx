import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateSettings } from "reducers/settings.reducer";
import Button from "./Button";
import Api from "apiClient";

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

const MusicLibrarySetting = ({ musicLibraryPath, dispatch }) => {
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
        >
          <FontAwesomeIcon icon="trash" />
        </Button>
      </MusicLibrarySettingPath>
      <Button onClick={addLibraryPath} isPrimary disabled={musicLibraryPath}>
        Add new
      </Button>
    </Container>
  );
};

export default connect(
  (state) => ({
    musicLibraryPath: state.settings.musicLibraryPath,
  }),
  (dispatch) => ({ dispatch }),
)(MusicLibrarySetting);
