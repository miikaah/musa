import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { dispatchToast } from "../util";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import AlbumImage from "./common/AlbumImageV2";
import { formatDuration } from "../util";

const AlbumContainer = styled.div`
  display: flex;
  flex: 100%;
  margin: 0 10px 60px 0;
`;

const bottomBorder = css`
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;
`;

const AlbumFullAdd = styled.div`
  display: flex;
  flex: 60%;
  ${bottomBorder}

  > img {
    min-width: 200px;
    max-width: 200px;
    min-height: 200px;
    max-height: 200px;
    background-color: #000;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const AlbumInfo = styled.div`
  padding: 4px 20px;

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
  flex: 40%;
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

const Album = ({ item, dispatch }) => {
  if (!item) {
    return null;
  }

  const addAlbumSongsToPlaylist = () => {
    dispatch(
      pasteToPlaylist(
        item.files.map((s) => ({
          ...s,
          cover: item.coverUrl,
        }))
      )
    );

    const msg = `Added ${album} to playlist`;
    const key = `${album}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const addSongToPlaylist = (song) => {
    dispatch(addToPlaylist({ ...song, cover: item.coverUrl }));

    const title = song?.metadata?.title || "";
    const msg = `Added ${title} to playlist`;
    const key = `${title}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const artist = item?.metadata?.artist || "";
  const album = item?.metadata?.album || "";
  const year = item?.metadata?.year || "";
  const genre = (item?.metadata?.genre || []).join(", ");

  return (
    <AlbumContainer>
      <AlbumFullAdd onClick={addAlbumSongsToPlaylist}>
        <AlbumImage item={item} />
        <AlbumInfo>
          <p>{artist}</p>
          <p>{album}</p>
          <p>{year}</p>
          <p>{genre}</p>
        </AlbumInfo>
      </AlbumFullAdd>
      <AlbumSongs>
        {item.files.map((s, i) => (
          <AlbumSong key={i} onClick={() => addSongToPlaylist(s)}>
            <span>{s?.metadata?.track?.no || ""}</span>
            <span>{s?.metadata?.title || ""}</span>
            <span>{formatDuration(s?.metadata?.duration || "")}</span>
          </AlbumSong>
        ))}
      </AlbumSongs>
    </AlbumContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Album);
