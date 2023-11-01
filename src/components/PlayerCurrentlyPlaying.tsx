import React from "react";
import styled, { css } from "styled-components";
import AlbumImageV2 from "./common/AlbumImageV2";
import { ellipsisTextOverflow } from "../common.styles";
import { fadeIn } from "../animations";
import { AudioWithMetadata } from "@miikaah/musa-core";

const commonImageCss = css`
  width: 50px;
  height: 50px;
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  background: #d7d7d7;
`;

const Container = styled.div`
  display: flex;

  img {
    ${commonImageCss}
    object-fit: cover;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 290px;
  padding: 12px;

  > div {
    ${ellipsisTextOverflow}
    animation: ${fadeIn} 0.2s;
  }

  > div:first-of-type {
    font-size: 12px;
    font-weight: bold;
  }

  > div:last-of-type {
    font-size: 11px;
    margin-top: 2px;
    color: var(--color-typography-ghos);
  }
`;

const PlaceholderImage = styled.div`
  ${commonImageCss}
  opacity: 0.666;
`;

const PlaceholderLine = styled.div<{ isFirst?: boolean }>`
  background: #d7d7d7;
  border-radius: 50px;
  animation: ${fadeIn} 0.2s;
  margin-top: ${({ isFirst }) => !isFirst && 5}px;
  width: ${({ isFirst }) => (isFirst ? 80 : 60)}px;
  height: 10px;
  opacity: 0.666;
`;

type PlayerCurrentlyPlayingProps = { currentItem?: AudioWithMetadata };

const PlayerCurrentlyPlaying = React.memo(
  ({ currentItem }: PlayerCurrentlyPlayingProps) => {
    const { artist, title } = currentItem?.metadata || {};
    const songTitle = title || currentItem?.name;
    const hasCurrentItem = !!Object.keys(currentItem || {}).length;

    if (!currentItem) {
      return null;
    }

    return (
      <Container>
        {hasCurrentItem ? (
          <AlbumImageV2 item={currentItem} animate={false} />
        ) : (
          <PlaceholderImage />
        )}
        <Info>
          {songTitle ? (
            <div title={songTitle}>{songTitle}</div>
          ) : (
            <PlaceholderLine isFirst />
          )}
          {songTitle || artist ? <div>{artist}</div> : <PlaceholderLine />}
        </Info>
      </Container>
    );
  },
);

export default PlayerCurrentlyPlaying;
