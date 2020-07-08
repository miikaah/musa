import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Playlist from "components/PlaylistV3";
import Cover from "components/Cover";

const Container = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: var(--toolbar-height);
`;

const AppMain = ({ isLarge, dispatch }) => {
  const onDragOver = event => event.preventDefault();

  const onDrop = event => {
    const item = JSON.parse(event.dataTransfer.getData("text"));
    if (Array.isArray(item)) {
      dispatch(pasteToPlaylist(item));
      return;
    }
    dispatch(addToPlaylist(item));
  };

  return (
    <Container onDragOver={onDragOver} onDrop={onDrop}>
      <Cover />
      <Playlist />
    </Container>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(AppMain);
