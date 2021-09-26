import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import { setScanProps } from "reducers/library.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const Container = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: var(--toolbar-height);
`;

const AppMain = ({ isLarge, dispatch }) => {
  useEffect(() => {
    if (ipc) {
      ipc.on("musa:startScan", (event, scanLength) => {
        dispatch(setScanProps({ scanLength }));
      });
      ipc.on("musa:updateScan", (event, scannedLength) => {
        dispatch(setScanProps({ scannedLength }));
      });
      ipc.on("musa:endScan", () => {
        dispatch(setScanProps({ reset: true }));
      });
      ipc.send("musa:onInit");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const { isArtist, isAlbum, item } = data;

    if (isArtist) {
      if (ipc) {
        ipc.once("musa:artistAlbums:response", (event, artist) => {
          const songs = artist.albums
            .map((a) => a.files.map((f) => ({ ...f, cover: a.coverUrl })))
            .flat(Infinity);

          dispatch(pasteToPlaylist(songs));
        });
        ipc.send("musa:artistAlbums:request", item.id);

        return;
      } else {
        return fetch(item.url)
          .then((response) => response.json())
          .then(async (artist) => {
            const albumUrls = artist.albums.map((a) => fetch(a.url));
            const responses = await Promise.all(albumUrls);
            const albums = [];

            for (const r of responses) {
              albums.push(await r.json());
            }

            const songs = albums
              .map((a) => a.files.map((f) => ({ ...f, cover: a.coverUrl })))
              .flat(Infinity);

            dispatch(pasteToPlaylist(songs));
          });
      }
    } else if (isAlbum) {
      if (ipc) {
        ipc.once("musa:album:response:AppMain", (event, album) => {
          const mappedFiles = album.files.map((f) => ({
            ...f,
            cover: album.coverUrl,
          }));

          dispatch(pasteToPlaylist(mappedFiles));
        });
        ipc.send("musa:album:request:AppMain", item.id);

        return;
      } else {
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
