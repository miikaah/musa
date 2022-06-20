import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";

const AlbumContainer = styled.div`
  display: flex;
  margin: 0 10px 10px 0;
`;

const bottomBorder = css`
  cursor: pointer;
  border: 0 solid transparent;
  border-bottom-width: 2px;
`;

const AlbumFullAdd = styled.div`
  display: flex;
  flex: 100%;
  max-height: 80px;
  ${bottomBorder}

  > img {
    min-width: 80px;
    max-width: 80px;
    min-height: 80px;
    max-height: 80px;
    background-color: #d7d7d7;
  }

  :hover {
    border-color: var(--color-primary-highlight);
  }
`;

const AlbumInfo = styled.div`
  padding: 4px 20px;

  > p {
    margin: 0 0 10px;
  }

  > p:not(:nth-child(1)) {
    font-size: var(--font-size-xs);
  }

  > p:nth-child(1) {
    font-weight: bold;
    max-height: 38px;
    overflow: hidden;
  }

  > p > span:nth-child(2) {
    margin: 0 4px;
  }
`;

const Album = ({ item, dispatch }) => {
  if (!item) {
    return null;
  }

  const addAlbumSongsToPlaylist = () => {
    const msg = `Added ${album} to playlist`;
    const key = `${album}-${Date.now()}`;

    dispatch(
      pasteToPlaylist(
        item.files.map((s) => ({
          ...s,
          coverUrl: item.coverUrl,
        }))
      )
    );
    dispatchToast(msg, key, dispatch);
  };

  const artist =
    item?.metadata?.artist ||
    item.artistName ||
    (item?.files || [])[0]?.metadata?.artist ||
    "";
  const album = item?.metadata?.album || item.name || "";
  const year = item?.metadata?.year || item?.year || "";

  return (
    <AlbumContainer>
      <AlbumFullAdd onClick={addAlbumSongsToPlaylist}>
        <AlbumImage item={item} />
        <AlbumInfo>
          <p title={album}>{album}</p>
          <p>
            <span>{artist}</span>
            <span>{artist && year ? "\u00B7" : ""}</span>
            {year && <span>{year}</span>}
          </p>
        </AlbumInfo>
      </AlbumFullAdd>
    </AlbumContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Album);
