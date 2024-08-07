import React from "react";
import styled, { css } from "styled-components";
import AlbumImage from "../AlbumImage";
import { ellipsisTextOverflow } from "../../common.styles";
import { fadeIn } from "../../animations";
import { AudioItem } from "../../types";

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

type PlayerCurrentlyPlayingProps = { currentItem?: AudioItem };

const PlayerCurrentlyPlaying = React.memo(
  ({ currentItem }: PlayerCurrentlyPlayingProps) => {
    const { artist, title } = currentItem?.metadata || {};
    const songTitle = title || currentItem?.name;

    return (
      <Container>
        {currentItem?.coverUrl ? (
          <AlbumImage item={currentItem} animate={false} />
        ) : (
          <PlaceholderImage data-testid="PlaceholderImage" />
        )}
        <Info>
          {songTitle ? (
            <div title={songTitle}>{songTitle}</div>
          ) : (
            <PlaceholderLine isFirst data-testid="PlaceholderLine1" />
          )}
          {songTitle || artist ? (
            <div>{artist}</div>
          ) : (
            <PlaceholderLine data-testid="PlaceholderLine2" />
          )}
        </Info>
      </Container>
    );
  },
);

export default PlayerCurrentlyPlaying;
