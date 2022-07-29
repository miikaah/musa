import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import { setFilter } from "reducers/library.reducer";
import AlbumImage from "./common/AlbumImageV2";

const AlbumContainer = styled.div`
  display: flex;
  margin: 0 8px 10px 0;
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
  padding: 0 10px 4px 14px;

  > p {
    margin: 0 0 10px;
  }

  > p:not(:nth-child(1)) {
    font-size: var(--font-size-xxs);
  }

  > p:nth-child(1) {
    font-weight: bold;
    max-height: 38px;
    overflow: hidden;
    letter-spacing: -0.5px;
  }

  > p > span:nth-child(2) {
    margin: 0 4px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-self: stretch;
  width: 30px;

  svg {
    align-self: center;
  }

  :hover {
    cursor: pointer;
    color: var(--color-primary-highlight);
  }
`;

const Album = ({ item, filter, dispatch }) => {
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

  const handleFiltering = () => {
    if (isFilteringByThisAlbum) {
      dispatch(setFilter(`${filter.split(",")[0]},`));
    } else {
      dispatch(
        setFilter(
          `${artistFilter || artist.toLowerCase()},${album.toLowerCase()}`
        )
      );
    }
  };

  const artist =
    item?.metadata?.artist ||
    item.artistName ||
    (item?.files || [])[0]?.metadata?.artist ||
    "";
  const album = item?.metadata?.album || item.name || "";
  const year = item?.metadata?.year || item?.year || "";
  const [artistFilter, albumFilter] = filter.split(",");
  const isFilteringByThisAlbum =
    artistFilter &&
    albumFilter &&
    album.toLowerCase().startsWith((albumFilter || "").trim());

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
      <IconWrapper onClick={handleFiltering}>
        {isFilteringByThisAlbum ? (
          <FontAwesomeIcon icon="chevron-left" />
        ) : (
          <FontAwesomeIcon icon="chevron-right" />
        )}
      </IconWrapper>
    </AlbumContainer>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(Album);
