import React from "react";
import AlbumImageV2 from "./common/AlbumImageV2";
import styled, { css } from "styled-components/macro";
import { fadeIn } from "animations";

const commonContainerCss = css`
  width: 50px;
  height: 50px;
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  border: 1px solid #d7d7d7;
`;

const Container = styled.div`
  display: flex;

  img {
    ${commonContainerCss}
  }
`;

const commonInfoCss = css`
  display: flex;
  flex-direction: column;
  max-width: 290px;
  padding: 12px;
`;

const Info = styled.div`
  ${commonInfoCss}

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

const PlaceholderContainer = styled.div`
  display: flex;
`;

const PlaceholderImage = styled.div`
  ${commonContainerCss}
`;

const PlaceholderLineContainer = styled.div`
  ${commonInfoCss}

  > div {
    background: #d7d7d7;
    border-radius: 50px;
    animation: ${fadeIn} 0.2s;
    margin-top: 5px;
  }

  > div:first-of-type {
    width: 80px;
    height: 10px;
  }

  > div:last-of-type {
    width: 66px;
    height: 10px;
  }
`;

const PlaceholderLine = styled.div``;

const PlayerCurrentlyPlaying = ({ currentItem }) => {
  if (typeof currentItem?.metadata !== "object") {
    return (
      <PlaceholderContainer>
        <PlaceholderImage />
        <PlaceholderLineContainer>
          <PlaceholderLine />
          <PlaceholderLine />
        </PlaceholderLineContainer>
      </PlaceholderContainer>
    );
  }

  const { artist, title, name } = currentItem.metadata;
  const songTitle = title || name || "No title";

  return (
    <Container>
      <AlbumImageV2 item={currentItem} />
      <Info>
        <div title={songTitle}>{songTitle}</div>
        <div>{artist || ""}</div>
      </Info>
    </Container>
  );
};

export default PlayerCurrentlyPlaying;
