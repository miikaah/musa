import React, { useState } from "react";
import { isEmpty } from "lodash-es";
import styled from "styled-components/macro";
import LibraryItem from "./LibraryItem";
import AlbumCover from "./common/AlbumCoverV2";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron) {
  ipc = window.require("electron").ipcRenderer;
}

const LibraryListContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
  padding-left: ${({ isRoot }) => (isRoot ? 0 : 12)}px;
  padding-right: 12px;

  > li:nth-child(2) {
    padding-top: 4px;
  }

  > li:last-child:not(:first-child) {
    margin-bottom: 20px;
  }

  > li:hover {
    background-color: var(--color-secondary-highlight);
    color: var(--color-typography-secondary);
  }
`;

const LibraryListFolder = styled.li`
  cursor: pointer;
  padding: 2px 12px;
  letter-spacing: 0.666px;

  > div {
    max-width: 100%;
    border: 0;
    margin: 5px 0;
  }
`;

const LibraryList = ({ item, cover, isArtist, isAlbum }) => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const isUndefinedItemName = item.name === "undefined";

  const toggleAlbum = () => {
    if (albums.length < 1 && !showAlbums) {
      if (ipc) {
        ipc.on("musa:artist:response", (event, data) => {
          setAlbums(data.albums);
        });
        ipc.send("musa:artist:request", item.id);
      } else {
        fetch(item.url)
          .then((response) => response.json())
          .then((data) => {
            setAlbums(data.albums);
          });
      }
    }
    setShowAlbums(!showAlbums);
  };

  const toggleSongs = () => {
    if (songs.length < 1 && !showSongs) {
      if (ipc) {
        ipc.on("musa:album:response", (event, data) => {
          setSongs(data.files);
        });
        ipc.send("musa:album:request", item.id);
      } else {
        fetch(item.url)
          .then((response) => response.json())
          .then((data) => {
            setSongs(data.files);
          });
      }
    }
    setShowSongs(!showSongs);
  };

  const onDragStart = (event) => {
    console.log({ isArtist, isAlbum, item });
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ isArtist, isAlbum, item })
    );

    event.stopPropagation();
  };

  const renderItemsWithoutAlbum = () =>
    item.songs.filter(Boolean).map((song, i) => {
      return <LibraryItem key={`${song.name}-${i}`} item={song} />;
    });

  const renderFolderName = () =>
    isAlbum ? (
      <AlbumCover item={item} />
    ) : isEmpty(item.name) ? (
      item.path
    ) : (
      item.name
    );

  const renderArtistsAndAlbums = () => (
    <LibraryListContainer isRoot={isArtist} draggable onDragStart={onDragStart}>
      <LibraryListFolder
        key={item.id}
        onClick={isArtist ? toggleAlbum : toggleSongs}
      >
        {renderFolderName()}
      </LibraryListFolder>
      {showAlbums &&
        Array.isArray(albums) &&
        albums.length &&
        albums.map((album, i) => (
          <LibraryList
            key={album.id}
            item={album}
            cover={item.coverUrl}
            isAlbum
          />
        ))}
      {showSongs &&
        Array.isArray(songs) &&
        songs.length &&
        songs.map((album, i) => (
          <LibraryList key={album.id} item={album} cover={item.coverUrl} />
        ))}
    </LibraryListContainer>
  );

  if (isArtist || isAlbum) {
    return isUndefinedItemName
      ? renderItemsWithoutAlbum()
      : renderArtistsAndAlbums();
  }
  return <LibraryItem item={item} cover={cover} hasAlbum />;
};

export default LibraryList;
