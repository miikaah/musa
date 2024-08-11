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
import { isElectron } from "../config";
import * as Api from "../apiClient";
import { SettingsState } from "../reducers/settings.reducer";
import NormalizationEditor from "../components/NormalizationEditor";
import MetadataEditor from "../components/MetadataEditor";
import { EditorMode } from "../types";

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

const getModalTitle = (mode: EditorMode) => {
  switch (mode) {
    case "normalization":
      return "modal.normalization.title";
    case "metadata":
      return "modal.metadata.title";
    default:
      mode satisfies never;
      throw new Error(`Unsupported modal mode: ${mode}`);
  }
};

const getModalChildren = (
  mode: EditorMode,
  activeIndex: number,
  filesToEdit: AudioWithMetadata[],
) => {
  switch (mode) {
    case "normalization":
      return <NormalizationEditor files={filesToEdit} />;
    case "metadata":
      return <MetadataEditor activeIndex={activeIndex} files={filesToEdit} />;
    default:
      mode satisfies never;
      throw new Error(`Unsupported modal mode: ${mode}`);
  }
};

type AppMainProps = {
  isInit: SettingsState["isInit"];
  musicLibraryPath: SettingsState["musicLibraryPath"];
  dispatch: Dispatch;
};

const AppMain = ({ isInit, musicLibraryPath, dispatch }: AppMainProps) => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [filesToEdit, setFilesToEdit] = useState<AudioWithMetadata[]>([]);
  const [modalMode, setModalMode] = useState<EditorMode>("normalization");

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) =>
    event.preventDefault();

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
    setFilesToEdit(items);
    setShowModal(true);
  };

  const closeModal = () => {
    setFilesToEdit([]);
    setShowModal(false);
  };

  const toggleModal = (
    mode: EditorMode,
    index: number,
    items: AudioWithMetadata[],
  ) => {
    setActiveIndex(index);
    setModalMode(mode);
    if (showModal) {
      closeModal();
    } else {
      openModal(items);
    }
  };

  return (
    <Container
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid="AppMainContainer"
    >
      <Cover />
      <Playlist toggleModal={toggleModal} />
      {showModal && (
        <Modal
          modalTitleTranslationKey={getModalTitle(modalMode)}
          closeModal={closeModal}
        >
          {getModalChildren(modalMode, activeIndex, filesToEdit)}
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
