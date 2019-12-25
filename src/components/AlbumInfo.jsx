import React from "react";
import styled from "styled-components/macro";

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

const getArtists = item => {
  if (item.artist) return item.artist;
  return (item.artists || []).map(a => a.name).join(", ");
};

const getDate = item => {
  if (item.date) return item.date;
  return item.release_date && item.release_date.split("-")[0];
};

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
