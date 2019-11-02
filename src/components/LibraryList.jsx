import React, { useState } from "react";
import { connect } from "react-redux";
import { flatten, defaultTo } from "lodash-es";
import styled from "styled-components/macro";
import LibraryItem from "./LibraryItem";
import AlbumCover from "./AlbumCover";

const LibraryListContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
  padding-left: ${({ isRoot }) => (isRoot ? 0 : 12)}px;
  font-size: 0.9rem;

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

  > div {
    max-width: 100%;
    border: 0;
    margin: 5px 0;
  }
`;

const LibraryList = ({ item, cover, isRoot, dispatch }) => {
  const [showFolderItems, setShowFolderItems] = useState(false);
  const isArtist = Array.isArray(item.albums);
  const isAlbum = Array.isArray(item.songs);
  const isUndefinedItemName = item.name === "undefined";

  const toggleFolder = event => {
    event.preventDefault();
    setShowFolderItems(!showFolderItems);
  };

  const getArtistOrAlbumSongs = () => {
    if (isArtist)
      return flatten(
        item.albums.map(a =>
          defaultTo(a.songs, []).map(s => ({ ...s, cover: a.cover }))
        )
      );
    if (isAlbum)
      return item.songs.map(song => ({ ...song, cover: item.cover }));
  };

  const onDragStart = event => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify(getArtistOrAlbumSongs())
    );
    event.stopPropagation();
  };

  const renderItemsWithoutAlbum = () =>
    item.songs.filter(Boolean).map((song, i) => {
      return <LibraryItem key={`${song.name}-${i}`} item={song} />;
    });

  const renderFolderName = () =>
    isAlbum ? <AlbumCover item={item} /> : item.name;

  const renderArtistsAndAlbums = () => (
    <LibraryListContainer isRoot={isRoot} draggable onDragStart={onDragStart}>
      <LibraryListFolder key={item.name} onClick={toggleFolder}>
        {renderFolderName()}
      </LibraryListFolder>
      {showFolderItems &&
        (item.albums || item.songs).map((child, i) => (
          <LibraryList
            key={`${child.name}-${i}`}
            item={child}
            cover={item.cover}
            dispatch={dispatch}
          />
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

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryList);
