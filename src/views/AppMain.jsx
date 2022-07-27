import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Navigate } from "react-router-dom";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import { setScanProps } from "reducers/library.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";
import Modal from "components/Modal";
import TagEditor from "components/TagEditor";
import { dispatchToast } from "../util";
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

  useEffect(() => {
    Api.addScanStartListener(({ scanLength, scanColor }) => {
      dispatch(setScanProps({ scanLength, scanColor }));
    });
    Api.addScanUpdateListener(({ scannedLength }) => {
      dispatch(setScanProps({ scannedLength }));
    });
    Api.addScanEndListener(() => {
      dispatch(setScanProps({ reset: true }));
    });
    Api.addScanCompleteListener(() => {
      dispatchToast("Update complete", "update-complete", dispatch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const { isArtist, isAlbum, item } = data;

    if (isArtist) {
      const artist = await Api.getArtistAlbums(item.id);
      const songs = artist.albums
        .map((a) => a.files.map((f) => ({ ...f, coverUrl: a.coverUrl })))
        .flat(Infinity);

      dispatch(pasteToPlaylist([...songs, ...artist.files]));

      return;
    } else if (isAlbum) {
      const album = await Api.getAlbumById(isElectron ? item.id : item.url);
      const mappedFiles = album.files.map((f) => ({
        ...f,
        coverUrl: album.coverUrl,
      }));

      dispatch(pasteToPlaylist(mappedFiles));

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
