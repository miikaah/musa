import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";

const SongContainer = styled.div`
  display: flex;
  flex: 48%;
  max-width: 48%;
  max-height: 80px;
  margin: 0 12px 20px 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;

  > img {
    flex: 50%;
    min-width: 80px;
    max-width: 80px;
    min-height: 80px;
    max-height: 80px;
    background-color: $musa-black;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const SongInfo = styled.div`
  flex: 50%;
  padding: 4px 20px;
  max-width: 308px;

  > p {
    margin: 0 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  > p:not(:nth-child(1)) {
    font-size: var(--font-size-xs);
  }

  > p:nth-child(1) {
    font-weight: bold;
  }
`;

const Song = ({ item, dispatch }) => {
  if (!item) {
    return null;
  }

  const addSongToPlaylist = () => {
    dispatch(addToPlaylist(item));

    const msg = `Added ${item.name} to playlist`;
    const key = `${item.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const artist = item?.metadata?.artist || item.artistName || "";
  const title = item?.metadata?.title || item?.name || "";

  return (
    <SongContainer onClick={addSongToPlaylist}>
      <AlbumImage item={item} />
      <SongInfo>
        <p title={title}>{title}</p>
        <p>{artist}</p>
      </SongInfo>
    </SongContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Song);
