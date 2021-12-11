import React, { useState } from "react";
import styled, { css } from "styled-components/macro";
import LibraryItem from "./LibraryItem";
import AlbumCover from "./common/AlbumCoverV2";
import config from "config";
import Api from "api-client";
import {
  expandHeight,
  contractHeight,
  fadeOut,
  expandHeightAlbum,
  contractHeightAlbum,
} from "animations";

const { isElectron } = config;

const getExpandTiming = (len) => {
  if (len < 2) {
    return "0.1s";
  } else if (len < 7) {
    return "0.1666s";
  } else if (len < 10) {
    return "0.2666s";
  } else if (len < 14) {
    return "0.3666s";
  } else if (len < 18) {
    return "0.4666s";
  } else if (len < 22) {
    return "0.5666s";
  } else {
    return "0.6s";
  }
};

const getContractTiming = (len) => {
  if (len < 2) {
    return "0.1666s";
  } else if (len < 7) {
    return "0.2s";
  } else {
    return "0.3s";
  }
};

const Container = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
  padding-left: ${({ isRoot }) => (isRoot ? 0 : 12)}px;
  padding-right: 12px;
  ${({ isRoot, expand, albumsLen, songsLen, filesLen }) => {
    if (expand) {
      if (isRoot) {
        return css`
          overflow: hidden;
          animation: ${expandHeight(albumsLen, filesLen)}
            ${getExpandTiming(albumsLen)} ease-out;
        `;
      } else {
        return css`
          overflow: hidden;
          animation: ${expandHeightAlbum(songsLen)} 0.1666s ease-out;
        `;
      }
    } else {
      if (isRoot) {
        return css`
          overflow: hidden;
          animation: ${contractHeight(albumsLen, filesLen)}
            ${getContractTiming(albumsLen)} ease;

          > ul {
            animation: ${fadeOut} ${getContractTiming(albumsLen)};
          }
        `;
      } else {
        return css`
          overflow: hidden;
          animation: ${contractHeightAlbum(songsLen)} 0.1666s ease;

          > ul,
          li:not(:first-of-type) {
            animation: ${fadeOut} 0.1666s;
          }
        `;
      }
    }
  }}

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

const Folder = styled.li`
  cursor: pointer;
  padding: 2px 12px;
  letter-spacing: 0.666px;

  > div {
    max-width: 100%;
    border: 0;
    margin: 5px 0;
  }
`;

const LibraryList = ({ item, isArtist, isAlbum, hasMultipleDisks }) => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [files, setFiles] = useState([]);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSongs, setShowSongs] = useState(false);

  const toggleAlbum = async () => {
    if (albums.length < 1 && !showAlbums) {
      const identifier = isElectron ? item.id : item.url;
      const artist = await Api.getArtistById(identifier);

      setAlbums(artist.albums);
      setFiles(artist.files);
    }

    if (!showAlbums) {
      setShowAlbums(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      setTimeout(
        () => setShowAlbums(false),
        Number(getContractTiming(albums.length).replace("s", "")) * 1000 - 100
      );
    }
  };

  const toggleSongs = async () => {
    if (songs.length < 1 && !showSongs) {
      const identifier = isElectron ? item.id : item.url;
      const album = await Api.getAlbumById(identifier);

      setSongs(album.files);
    }

    if (!showSongs) {
      setShowSongs(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      setTimeout(() => setShowSongs(false), 150);
    }
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ isArtist, isAlbum, item })
    );

    event.stopPropagation();
  };

  const renderFolderName = () =>
    isAlbum ? <AlbumCover item={item} /> : <>{item.name || "Unknown title"}</>;

  const renderArtistsAndAlbums = () => (
    <Container
      isRoot={isArtist}
      draggable
      onDragStart={onDragStart}
      expand={showAnimation}
      albumsLen={albums.length}
      songsLen={songs.length}
      filesLen={files.length}
    >
      <Folder key={item.id} onClick={isArtist ? toggleAlbum : toggleSongs}>
        {renderFolderName()}
      </Folder>
      {showAlbums &&
        Array.isArray(albums) &&
        albums.length > 0 &&
        albums.map((album, i) => (
          <LibraryList key={album.id} item={album} isAlbum />
        ))}
      {showSongs &&
        Array.isArray(songs) &&
        songs.length > 0 &&
        songs.map((album, i) => (
          <LibraryList
            key={album.id}
            item={album}
            hasMultipleDisks={
              !(songs[songs.length - 1]?.track || "").startsWith("1")
            }
          />
        ))}
      {showAlbums &&
        files.length > 0 &&
        files.map((song, i) => (
          <LibraryItem key={`${song.name}-${i}`} item={song} />
        ))}
    </Container>
  );

  if (isArtist || isAlbum) {
    return renderArtistsAndAlbums();
  }
  return (
    <LibraryItem item={item} hasAlbum hasMultipleDisks={hasMultipleDisks} />
  );
};

export default LibraryList;
