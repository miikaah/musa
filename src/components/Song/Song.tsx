import React from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import { dispatchToast } from "../../util";
import { addToPlaylist } from "../../reducers/player.reducer";
import { setQuery } from "../../reducers/search.reducer";
import {
  listImage,
  cardActionShadow,
  ellipsisTextOverflow,
} from "../../common.styles";
import AlbumImage from "../AlbumImage";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFnFn } from "../../i18n";
import { AudioWithMetadata } from "@miikaah/musa-core";

const SongContainer = styled.div<{ hasCover: boolean }>`
  display: flex;
  max-height: 80px;
  margin: 0 8px 10px 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;

  ${listImage}

  &:hover {
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

  > p:nth-child(1) > span,
  > p:nth-child(2) > span {
    &:hover {
      text-decoration: underline;
    }
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

  > p:nth-child(3) > span:nth-child(1),
  > p:nth-child(3) > span:nth-child(3) {
    &:hover {
      text-decoration: underline;
    }
  }
`;

type SongProps = {
  item?: AudioWithMetadata;
  t: TranslateFnFn;
};

const Song = ({ item, t }: SongProps) => {
  const dispatch = useDispatch();

  if (!item) {
    return null;
  }

  const addSongToPlaylist = () => {
    dispatch(addToPlaylist(item));

    const msg = t("toast.addAlbumOrSongToPlaylist")(item.name);
    const key = `${item.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const setSongToSearchQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setQuery(title));
  };

  const setAlbumToSearchQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setQuery(`album:${album}`));
  };

  const setArtistToSearchQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setQuery(`artist:${artist}`));
  };

  const setYearToSearchQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setQuery(`year:${year}`));
  };

  const artist = item?.metadata?.artist || item?.artistName || "";
  const album = item?.metadata?.album || item?.albumName || "";
  const title = item?.metadata?.title || item?.name || "";
  const year = item?.metadata?.year || "";

  return (
    <SongContainer
      onClick={addSongToPlaylist}
      hasCover={!!item.coverUrl}
      data-testid="SongContainer"
    >
      <div>
        <AlbumImage item={item} />
      </div>
      <SongInfo>
        <p>
          <span title={title} onClick={setSongToSearchQuery}>
            {title}
          </span>
        </p>
        {album && (
          <p>
            <span title={album} onClick={setAlbumToSearchQuery}>
              {album}
            </span>
          </p>
        )}
        <p>
          <span onClick={setArtistToSearchQuery}>{artist}</span>
          <span>{artist && year ? "\u00B7" : ""}</span>
          {year && <span onClick={setYearToSearchQuery}>{year}</span>}
        </p>
      </SongInfo>
    </SongContainer>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(Song);
