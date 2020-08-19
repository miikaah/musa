import React, { useState } from "react";
import { connect } from "react-redux";
import { flatten, defaultTo, isEmpty } from "lodash-es";
import styled from "styled-components/macro";
import LibraryItem from "./LibraryItem";
import AlbumCover from "./common/AlbumCover";

const LibraryListContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
  padding-left: ${({ isRoot }) => (isRoot ? 0 : 12)}px;

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

const LibraryList = ({ item, cover, isRoot, openLibraryPaths, dispatch }) => {
  const [showFolderItems, setShowFolderItems] = useState(false);
  const isArtist = Array.isArray(item.albums);
  const isAlbum = Array.isArray(item.songs);
  const isUndefinedItemName = item.name === "undefined";

  const toggleFolder = () => {
    setShowFolderItems(!showFolderItems);
  };

  const getArtistOrAlbumSongs = () => {
    if (isArtist)
      return flatten(
        item.albums.map((a) =>
          defaultTo(a.songs, []).map((s) => ({ ...s, cover: a.cover }))
        )
      );
    if (isAlbum)
      return item.songs.map((song) => ({ ...song, cover: item.cover }));
  };

  const onDragStart = (event) => {
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
    isAlbum ? (
      <AlbumCover item={item} />
    ) : isEmpty(item.name) ? (
      item.path
    ) : (
      item.name
    );

  const renderArtistsAndAlbums = () => (
    <LibraryListContainer isRoot={isRoot} draggable onDragStart={onDragStart}>
      <LibraryListFolder key={item.path} onClick={toggleFolder}>
        {renderFolderName()}
      </LibraryListFolder>
      {showFolderItems &&
        (item.albums || item.songs).map((child, i) => (
          <LibraryList
            key={`${child.path}-${i}`}
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
  (dispatch) => ({ dispatch })
)(LibraryList);
