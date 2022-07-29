import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";

const SongContainer = styled.div`
  display: flex;
  max-height: 80px;
  margin: 0 8px 10px 0;
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
    background-color: #d7d7d7;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const SongInfo = styled.div`
  flex: 50%;
  padding: 0 0 4px 14px;
  max-width: 268px;

  > p {
    margin: 0 0 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  > p:nth-child(1) {
    font-weight: bold;
    max-height: 38px;
    letter-spacing: -0.5px;
  }

  > p:nth-child(2),
  > p:nth-child(3) {
    font-size: var(--font-size-xxs);
    margin: 0 0 3px;
    max-height: 15px;
    white-space: nowrap;
  }

  > p > span:nth-child(2) {
    margin: 0 4px;
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

  const artist = item?.metadata?.artist || item?.artistName || "";
  const album = item?.metadata?.album || item?.albumName || "";
  const title = item?.metadata?.title || item?.name || "";
  const year = item?.metadata?.year || "";

  return (
    <SongContainer onClick={addSongToPlaylist}>
      <AlbumImage item={item} />
      <SongInfo>
        <p title={title}>{title}</p>
        {album && <p title={album}>{album}</p>}
        <p>
          <span>{artist}</span>
          <span>{artist && year ? "\u00B7" : ""}</span>
          {year && <span>{year}</span>}
        </p>
      </SongInfo>
    </SongContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Song);
