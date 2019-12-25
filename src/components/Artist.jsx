import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash-es";
import styled from "styled-components/macro";

const ArtistName = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
  margin-right: 10px;
`;

const Artist = ({ item, dispatch }) => {
  if (isEmpty(item)) return null;
  return <ArtistName>{item.name}</ArtistName>;
};

export default connect(
  state => ({
    messages: state.toaster.messages
  }),
  dispatch => ({ dispatch })
)(Artist);
