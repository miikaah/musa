import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";

const Container = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: var(--toolbar-height);
`;

const AppMain = ({ isLarge, dispatch }) => {
  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const { isArtist, isAlbum, item } = data;

    if (isArtist) {
      return fetch(item.url)
        .then((response) => response.json())
        .then(async (data) => {
          const albumUrls = data.albums.map((a) => fetch(a.url));
          const responses = await Promise.all(albumUrls);
          const fetchedAlbums = [];

          for (const r of responses) {
            fetchedAlbums.push(await r.json());
          }

          const mappedFiles = fetchedAlbums
            .map((a) => a.files.map((f) => ({ ...f, cover: a.coverUrl })))
            .flat(Infinity);

          dispatch(pasteToPlaylist(mappedFiles));
        });
    } else if (isAlbum) {
      return fetch(item.url)
        .then((response) => response.json())
        .then((album) => {
          const mappedFiles = album.files.map((f) => ({
            ...f,
            cover: album.coverUrl,
          }));

          dispatch(pasteToPlaylist(mappedFiles));
        });
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
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(AppMain);
