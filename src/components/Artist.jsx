import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { setFilter } from "reducers/library.reducer";

const bottomBorder = css`
  cursor: pointer;
  border: 0 solid transparent;
  border-bottom-width: 2px;
`;

const ArtistContainer = styled.div`
  display: flex;
  ${bottomBorder}

  :hover {
    border-color: var(--color-primary-highlight);
  }
`;

const ArtistName = styled.div`
  margin-bottom: 6px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 96%;
`;

const Artist = ({ item: artist, dispatch }) => {
  if (!artist) {
    return null;
  }

  const title = artist.name;

  return (
    <ArtistContainer
      onClick={() => dispatch(setFilter(`${title.toLowerCase()},`))}
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
