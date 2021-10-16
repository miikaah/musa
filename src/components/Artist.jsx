import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";

const bottomBorder = css`
  cursor: pointer;
  border: 0 solid transparent;
  border-bottom-width: 2px;
`;

const ArtistContainer = styled.div`
  display: flex;
  flex: 25%;
  max-width: 25%;
  ${bottomBorder}

  :hover {
    border-color: var(--color-primary-highlight);
  }
`;

const ArtistName = styled.div`
  margin-bottom: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 95%;
`;

const Artist = ({ item: artist, dispatch }) => {
  if (!artist) {
    return null;
  }

  const addAlbumSongsToPlaylist = () => {
    artist.albums.forEach((album) => {
      const msg = `Added ${album.name} to playlist`;
      const key = `${album.name}-${Date.now()}`;

      dispatch(
        pasteToPlaylist(
          album.files.map((s) => ({
            ...s,
            cover: album.coverUrl,
          }))
        )
      );
      dispatchToast(msg, key, dispatch);
    });
  };

  return (
    <ArtistContainer onClick={addAlbumSongsToPlaylist}>
      <ArtistName title={artist.name}>{artist.name}</ArtistName>
    </ArtistContainer>
  );
};

export default connect(
  (state) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch })
)(Artist);
