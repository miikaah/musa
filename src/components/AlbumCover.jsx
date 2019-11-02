import React from "react";
import styled from "styled-components/macro";
import AlbumImage from "./AlbumImage";

const AlbumCoverContainer = styled.div`
  display: flex;
  flex: 30%;
  margin: 0 24px 30px 0;
  max-width: 30%;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;

  > img {
    flex: 20%;
    min-width: 60px;
    max-width: 60px;
    min-height: 60px;
    max-height: 60px;
    background-color: #000;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const AlbumInfo = styled.div`
  font-size: var(--font-size-sm);
  padding: 0 25px 0 20px;

  > p {
    margin: 0 0 8px;
  }
`;

const AlbumCover = ({ item, onClick }) => (
  <AlbumCoverContainer onClick={onClick}>
    <AlbumImage item={item} />
    <AlbumInfo>
      <p>{item.name}</p>
      <p>{item.date}</p>
    </AlbumInfo>
  </AlbumCoverContainer>
);

export default AlbumCover;
