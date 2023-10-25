import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import { setQuery } from "reducers/search.reducer";
import { listImage, cardActionShadow } from "common.styles";
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
  align-items: flex-start;
  ${bottomBorder}
  ${listImage}

  &:hover {
    ${cardActionShadow}
  }
`;

const AlbumInfo = styled.div`
  padding: 0 10px 0 14px;

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

  > p:nth-child(1) > span {
    &:hover {
      text-decoration: underline;
    }
  }

  > p > span:nth-child(2) {
    margin: 0 4px;
  }

  > p:nth-child(2) {
    margin: 0 0 2px;
  }

  > p:nth-child(2) > span:nth-child(1),
  > p:nth-child(2) > span:nth-child(3) {
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Album = ({ item, t, dispatch }) => {
  if (!item) {
    return null;
  }

  const addAlbumSongsToPlaylist = () => {
    const msg = t("toast.addAlbumOrSongToPlaylist")(album);
    const key = `${album}-${Date.now()}`;

    dispatch(
      pasteToPlaylist(
        item.files.map((s) => ({
          ...s,
          coverUrl: item.coverUrl,
        })),
      ),
    );
    dispatchToast(msg, key, dispatch);
  };

  const setAlbumToSearchQuery = (e) => {
    e.stopPropagation();
    dispatch(setQuery(`album:${album}`));
  };

  const setArtistToSearchQuery = (e) => {
    e.stopPropagation();
    dispatch(setQuery(`artist:${artist}`));
  };

  const setYearToSearchQuery = (e) => {
    e.stopPropagation();
    dispatch(setQuery(`year:${year}`));
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
      <AlbumFullAdd
        onClick={addAlbumSongsToPlaylist}
        hasCover={!!item.coverUrl}
      >
        <div>
          <AlbumImage item={item} />
        </div>
        <AlbumInfo>
          <p>
            <span title={album} onClick={setAlbumToSearchQuery}>
              {album}
            </span>
          </p>
          <p>
            <span onClick={setArtistToSearchQuery}>{artist}</span>
            <span>{artist && year ? "\u00B7" : ""}</span>
            {year && <span onClick={setYearToSearchQuery}>{year}</span>}
          </p>
        </AlbumInfo>
      </AlbumFullAdd>
    </AlbumContainer>
  );
};

export default connect(
  (state) => ({
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(Album);
