import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";
import Modal from "components/Modal";
import TagEditor from "components/TagEditor";
import config from "config";
import Api from "api-client";
import styled from "styled";

const { isElectron } = config;

const Container = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: var(--titlebar-height);

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;
  }
`;

const AppMain = ({ dispatch, isInit, musicLibraryPath }) => {
  const [showModal, setShowModal] = useState(false);
  const [filesToEdit, setFilesToBeEdited] = useState([]);

  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    if (event.dataTransfer.files.length > 0) {
      const paths = Array.from(event.dataTransfer.files).map(
        ({ path }) => path,
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

  const closeModal = () => {
    setFilesToBeEdited([]);
    setShowModal(false);
  };

  const toggleModal = (items) => {
    const itemsIds = items.map(({ id }) => id);
    const currentFilesIds = filesToEdit.map(({ id }) => id);
    const hasSameFiles = itemsIds.every((id) => currentFilesIds.includes(id));

    if (hasSameFiles) {
      closeModal(items);
    } else {
      openModal(items);
    }
  };

  return (
    <Container onDragOver={onDragOver} onDrop={onDrop}>
      <Cover />
      <Playlist toggleModal={toggleModal} />
      {showModal && (
        <Modal maxWidth={960} closeModal={closeModal}>
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
  (dispatch) => ({ dispatch }),
)(AppMain);
