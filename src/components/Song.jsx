import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";

const SongContainer = styled.div`
  display: flex;
  flex: 48%;
  margin: 0 10px 40px 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;

  > img {
    flex: 50%;
    min-width: 160px;
    max-width: 160px;
    min-height: 160px;
    max-height: 160px;
    background-color: $musa-black;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const SongInfo = styled.div`
  flex: 50%;
  padding: 4px 20px;

  > p {
    margin: 0 0 10px;
  }

  > p:not(:nth-child(3)) {
    font-size: $musa-font-size-xs;
  }

  > p:nth-child(3) {
    font-weight: bold;
  }
`;

const Song = ({ item, dispatch }) => {
  if (!item) {
    return null;
  }

  const addSongToPlaylist = () => {
    dispatch(
      addToPlaylist({
        ...item,
        cover: item.coverUrl,
      })
    );

    const msg = `Added ${item.name} to playlist`;
    const key = `${item.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const artist = item?.metadata?.artist;
  const album = item?.metadata?.album;
  const year = item?.metadata?.year;
  const title = item?.metadata?.title;

  return (
    <SongContainer onClick={addSongToPlaylist}>
      <AlbumImage item={item} />
      <SongInfo>
        <p>{artist}</p>
        <p>{album}</p>
        <p>{title}</p>
        <p>{year}</p>
      </SongInfo>
    </SongContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Song);
