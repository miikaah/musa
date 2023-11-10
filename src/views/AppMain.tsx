import { AudioWithMetadata } from "@miikaah/musa-core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { addToPlaylist, pasteToPlaylist } from "../reducers/player.reducer";
import Playlist from "../components/Playlist";
import Cover from "../components/Cover";
import Modal from "../components/Modal";
import TagEditor from "../components/TagEditor";
import { isElectron } from "../config";
import Api from "../apiClient";
import { SettingsState } from "../reducers/settings.reducer";

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

interface CustomFile extends File {
  path: string;
}

type AppMainProps = {
  isInit: SettingsState["isInit"];
  musicLibraryPath: SettingsState["musicLibraryPath"];
  dispatch: Dispatch;
};

const AppMain = ({ isInit, musicLibraryPath, dispatch }: AppMainProps) => {
  const [showModal, setShowModal] = useState(false);
  const [filesToEdit, setFilesToBeEdited] = useState<AudioWithMetadata[]>([]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) =>
    event.preventDefault();

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer) {
      return;
    }

    if (event.dataTransfer.files.length > 0) {
      const paths = Array.from(
        event.dataTransfer.files as unknown as CustomFile[],
      ).map(({ path }) => path);

      const files = await Api.getAudiosByFilepaths(paths);

      dispatch(pasteToPlaylist(files));

      return;
    }
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const { isArtist, isAlbum, item } = data;

    if (isArtist) {
      const artist = await Api.getArtistAlbums(item.id);
      const songs = artist.albums.map((a) => a.files).flat(Infinity);

      dispatch(
        pasteToPlaylist([...songs, ...artist.files] as AudioWithMetadata[]),
      );

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

  const openModal = (items: AudioWithMetadata[]) => {
    setFilesToBeEdited(items);
    setShowModal(true);
  };

  const closeModal = () => {
    setFilesToBeEdited([]);
    setShowModal(false);
  };

  const toggleModal = (items: AudioWithMetadata[]) => {
    const itemsIds = items.map(({ id }) => id);
    const currentFilesIds = filesToEdit.map(({ id }) => id);
    const hasSameFiles = itemsIds.every((id) => currentFilesIds.includes(id));

    if (hasSameFiles) {
      closeModal();
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
  (state: { settings: SettingsState }) => ({
    isInit: state.settings.isInit,
    musicLibraryPath: state.settings.musicLibraryPath,
  }),
  (dispatch) => ({ dispatch }),
)(AppMain);
