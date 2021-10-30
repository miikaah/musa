import React from "react";
import { connect } from "react-redux";
import { updateSettings } from "reducers/settings.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";
import Button from "./Button";
import Api from "api-client";

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
      })
    );
  };

  const addLibraryPath = () => {
    Api.addMusicLibraryPath().then((path) => {
      dispatch(
        updateSettings({
          musicLibraryPath: path,
        })
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
  (dispatch) => ({ dispatch })
)(MusicLibrarySetting);
