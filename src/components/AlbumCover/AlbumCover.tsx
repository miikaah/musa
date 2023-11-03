import { Artist } from "@miikaah/musa-core";
import React from "react";
import styled from "styled-components";
import AlbumImage from "../common/AlbumImageV2";

const AlbumCoverContainer = styled.div`
  display: flex;
  flex: 30%;
  margin: 0 22px 30px 0;
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
    margin: 0 0 4px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  > p:last-child {
    font-size: var(--font-size-xs);
  }
`;

type AlbumCoverProps = {
  item: Artist["albums"][0];
  onClick?: any;
};

const AlbumCover = ({ item, onClick }: AlbumCoverProps) => {
  const { name, year } = item;

  return (
    <AlbumCoverContainer onClick={onClick} data-testid="AlbumCoverContainer">
      <AlbumImage item={item} />
      <AlbumInfo>
        <p>{name}</p>
        <p>{year}</p>
      </AlbumInfo>
    </AlbumCoverContainer>
  );
};

export default AlbumCover;
