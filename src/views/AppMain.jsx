import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Redirect } from "react-router-dom";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import { setScanProps } from "reducers/library.reducer";
import Playlist from "components/PlaylistV4";
import Cover from "components/Cover";
import { dispatchToast } from "../util";

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

const AppMain = ({ isLarge, dispatch, isInit, musicLibraryPath }) => {
  useEffect(() => {
    if (ipc) {
      ipc.on("musa:scan:start", (event, scanLength, scanColor) => {
        dispatch(setScanProps({ scanLength, scanColor }));
      });
      ipc.on("musa:scan:update", (event, scannedLength) => {
        dispatch(setScanProps({ scannedLength }));
      });
      ipc.on("musa:scan:end", () => {
        dispatch(setScanProps({ reset: true }));
      });
      ipc.on("musa:scan:complete", (event, asd) => {
        dispatchToast("Update complete", `update-complete`, dispatch);
      });
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
          const files = [...songs, ...artist.files];

          dispatch(pasteToPlaylist(files));
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

    if (ipc) {
      ipc.once("musa:audio:response", (event, audio) => {
        dispatch(
          addToPlaylist({
            ...audio,
            cover: audio.coverUrl,
          })
        );
      });
      ipc.send("musa:audio:request", item.id);
    } else {
      dispatch(addToPlaylist(item));
    }
  };

  if (isInit && !musicLibraryPath) {
    return <Redirect to={{ pathname: "/settings" }} />;
  }

  return (
    <Container onDragOver={onDragOver} onDrop={onDrop}>
      <Cover />
      <Playlist />
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
