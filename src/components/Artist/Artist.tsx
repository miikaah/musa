import { ArtistWithEnrichedAlbums } from "@miikaah/musa-core";
import React from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { setQuery } from "../../reducers/search.reducer";
import { ellipsisTextOverflow } from "../../common.styles";

const bottomBorder = css`
  cursor: pointer;
  border: 0 solid transparent;
  border-bottom-width: 2px;
`;

const ArtistContainer = styled.div`
  display: flex;
  ${bottomBorder}

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const ArtistName = styled.div`
  font-size: var(--font-size-xs);
  margin-bottom: 6px;
  max-width: 96%;
  ${ellipsisTextOverflow}
`;

type ArtistProps = {
  item?: ArtistWithEnrichedAlbums;
};

const Artist = ({ item: artist }: ArtistProps) => {
  const dispatch = useDispatch();

  if (!artist) {
    return null;
  }

  const title = artist.name;

  return (
    <ArtistContainer
      onClick={() => dispatch(setQuery(`artist:${title.toLowerCase()}`))}
    >
      <ArtistName title={title}>{title}</ArtistName>
    </ArtistContainer>
  );
};

export default Artist;
