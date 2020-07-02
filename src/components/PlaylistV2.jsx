import React from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import styled, { css } from "styled-components/macro";
import AlbumImage from "./AlbumImage";

const AlbumContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const bottomBorder = css`
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;
`;

const CoverContainer = styled.div`
  ${bottomBorder}

  display: flex;
  flex: 61.8%;

  > img {
    min-width: 250px;
    max-width: 250px;
    min-height: 250px;
    max-height: 250px;
    background-color: #000;
  }
`;

const AlbumInfo = styled.div`
  padding: 4px 30px;

  > p {
    margin: 0 0 10px;
  }

  > p:not(:nth-child(2)) {
    font-size: var(--font-size-xs);
  }

  > p:nth-child(2) {
    font-weight: bold;
  }
`;

const AlbumSongs = styled.div`
  flex: 38.2%;
  font-size: var(--font-size-sm);
`;

const AlbumSong = styled.div`
  display: flex;
  flex-direction: row;
  ${bottomBorder}

  > span {
    margin-bottom: 4px;
  }

  > span:nth-child(1) {
    flex: 12%;
    font-size: var(--font-size-xs);
  }

  > span:nth-child(2) {
    flex: 78%;
    padding-right: 4px;
  }

  > span:nth-child(3) {
    flex: 10%;
    font-size: var(--font-size-xs);
    text-align: right;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const Playlist = ({
  onScrollPlaylist,
  album,
  playlist,
  currentItem,
  currentIndex,
  dispatch
}) => {
  return (
    <AlbumContainer>
      <CoverContainer>
        <AlbumImage item={album} />
        <AlbumInfo>
          <p>{get(album, "artist", "")}</p>
          <p>{get(album, "album", "")}</p>
          <p>{get(album, "date", "")}</p>
          <p>{get(album, "genre", "")}</p>
        </AlbumInfo>
      </CoverContainer>
      <AlbumSongs>
        {album.items.map((item, i) => (
          <AlbumSong key={i}>
            <span>{get(item, "metadata.track", "")}</span>
            <span>{get(item, "metadata.title", "")}</span>
            <span>{get(item, "metadata.duration", "")}</span>
          </AlbumSong>
        ))}
      </AlbumSongs>
    </AlbumContainer>
  );
};

export default connect(
  state => ({
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex
  }),
  dispatch => ({ dispatch })
)(Playlist);
