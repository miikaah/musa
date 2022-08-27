import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Navigate } from "react-router-dom";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";
import Modal from "components/Modal";
import TagEditor from "components/TagEditor";
import config from "config";
import Api from "api-client";

const { isElectron } = config;

const Container = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: var(--titlebar-height);
`;

const AppMain = ({ dispatch, isInit, musicLibraryPath }) => {
  const [showModal, setShowModal] = useState(false);
  const [filesToEdit, setFilesToBeEdited] = useState([]);

  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    if (event.dataTransfer.files.length > 0) {
      const paths = Array.from(event.dataTransfer.files).map(
        ({ path }) => path
      );

      const files = await Api.getAudiosByFilepaths(paths);

      dispatch(pasteToPlaylist(files));

      return;
    }
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const { isArtist, isAlbum, item } = data;

    if (isArtist) {
      const artist = await Api.getArtistAlbums(item.id);
      const songs = artist.albums.map((a) => a.files).flat(Infinity);

      dispatch(pasteToPlaylist([...songs, ...artist.files]));

      return;
    } else if (isAlbum) {
      const album = await Api.getAlbumById(isElectron ? item.id : item.url);

      dispatch(pasteToPlaylist(album.files));

      return;
    }

    const audio = await Api.getAudioById(isElectron ? item.id : item.url);

    dispatch(addToPlaylist(audio));
  };

  if (isInit && isElectron && !musicLibraryPath) {
    return <Navigate to="/settings" />;
  }

  const openModal = (items) => {
    setFilesToBeEdited(items);
    setShowModal(true);
  };

  return (
    <Container onDragOver={onDragOver} onDrop={onDrop}>
      <Cover />
      <Playlist openModal={openModal} />
      {showModal && (
        <Modal maxWidth={960} closeModal={() => setShowModal(false)}>
          <TagEditor files={filesToEdit} />
        </Modal>
      )}
    </Container>
  );
};

export default connect(
  (state) => ({
    isInit: state.settings.isInit,
    musicLibraryPath: state.settings.musicLibraryPath,
  }),
  (dispatch) => ({ dispatch })
)(AppMain);
