import React from "react";
import AlbumImageV2 from "./common/AlbumImageV2";
import styled from "styled-components/macro";

const Container = styled.div`
  display: flex;

  img {
    width: 50px;
    height: 50px;
    box-shadow: 0 0 10px rgb(0 0 0 / 30%);
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

const PlayerCurrentlyPlaying = ({ currentItem }) => {
  console.log(currentItem);
  const {
    metadata: { artist, title, name },
  } = currentItem;
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
