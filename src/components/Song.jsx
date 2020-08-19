import React from "react";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash-es";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImage";

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
  if (isEmpty(item)) return null;

  const addSongToPlaylist = () => {
    dispatch(addToPlaylist(item));

    const msg = `Added ${item.name} to playlist`;
    const key = `${item.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  return (
    <SongContainer onClick={addSongToPlaylist}>
      <AlbumImage item={item} />
      <SongInfo>
        <p>{get(item, "metadata.artist", "")}</p>
        <p>{get(item, "metadata.album", "")}</p>
        <p>{item.name}</p>
        <p>{get(item, "metadata.date", "")}</p>
      </SongInfo>
    </SongContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Song);
