import React from "react";
import styled from "styled-components/macro";
import { getArtists, getDate } from "../spotify.util";

const Info = styled.div`
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

const AlbumInfo = ({ item }) => {
  return (
    <Info>
      <p>{getArtists(item)}</p>
      <p>{item.name}</p>
      <p>{getDate(item)}</p>
      <p>{item.genre}</p>
    </Info>
  );
};

export default AlbumInfo;
