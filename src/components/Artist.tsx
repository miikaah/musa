import { Artist } from "@miikaah/musa-core";
import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { setQuery } from "../reducers/search.reducer";
import { ToasterState } from "../reducers/toaster.reducer";
import { ellipsisTextOverflow } from "../common.styles";
import { Dispatch } from "redux";

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
  item: Artist;
  dispatch: Dispatch;
};

const Artist = ({ item: artist, dispatch }: ArtistProps) => {
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
  (state: { toaster: ToasterState }) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch }),
)(Artist);
