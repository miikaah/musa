import React from "react";
import AlbumImageV2 from "./common/AlbumImageV2";
import styled, { css } from "styled-components/macro";
import { fadeIn } from "animations";

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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
`;

const PlaceholderLine = styled.div`
  background: #d7d7d7;
  border-radius: 50px;
  animation: ${fadeIn} 0.2s;
  margin-top: ${({ isFirst }) => !isFirst && 5}px;
  width: ${({ isFirst }) => (isFirst ? 80 : 60)}px;
  height: 10px;
`;

const PlayerCurrentlyPlaying = React.memo(({ currentItem }) => {
  const { artist, title } = currentItem.metadata || {};
  const songTitle = title || currentItem?.name;

  return (
    <Container>
      {currentItem.cover ? (
        <AlbumImageV2 item={currentItem} />
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
});

export default PlayerCurrentlyPlaying;
