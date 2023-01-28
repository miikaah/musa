import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist } from "reducers/player.reducer";
import { listImage, cardActionShadow } from "common.styles";
import { ellipsisTextOverflow } from "common.styles";
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

  ${listImage}

  :hover {
    ${cardActionShadow}
  }
`;

const SongInfo = styled.div`
  flex: 50%;
  padding: 0 0 4px 14px;
  max-width: 268px;

  > p {
    margin: 0 0 6px;
    ${ellipsisTextOverflow}
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
    <SongContainer onClick={addSongToPlaylist} hasCover={!!item.coverUrl}>
      <div>
        <AlbumImage item={item} />
      </div>
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
