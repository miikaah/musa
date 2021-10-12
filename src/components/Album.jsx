import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";

const AlbumContainer = styled.div`
  display: flex;
  flex: 45%;
  max-width: 50%;
  margin: 0 10px 20px 0;
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
    background-color: #000;
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
          cover: item.coverUrl,
        }))
      )
    );
    dispatchToast(msg, key, dispatch);
  };

  const artist = item?.metadata?.artist || "";
  const album = item?.metadata?.album || "";

  return (
    <AlbumContainer>
      <AlbumFullAdd onClick={addAlbumSongsToPlaylist}>
        <AlbumImage item={item} />
        <AlbumInfo>
          <p>{album}</p>
          <p>{artist}</p>
        </AlbumInfo>
      </AlbumFullAdd>
    </AlbumContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Album);
