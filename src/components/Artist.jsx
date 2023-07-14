import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { setQuery } from "reducers/search.reducer";
import { ellipsisTextOverflow } from "common.styles";

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

const Artist = ({ item: artist, dispatch }) => {
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

export default connect(
  (state) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch })
)(Artist);
