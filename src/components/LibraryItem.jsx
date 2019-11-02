import React from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import styled from "styled-components/macro";
import { addToPlaylist } from "reducers/player.reducer";

const LibraryItemContainer = styled.li`
  padding-left: 90px !important;
  cursor: pointer;
  padding-left: ${({ hasAlbum }) => !hasAlbum && "24px !important"};
`;

const LibraryItem = ({ item, cover, hasAlbum, dispatch }) => {
  const onDragStart = event => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ...item, cover })
    );
    event.stopPropagation();
  };

  return (
    <LibraryItemContainer
      hasAlbum={hasAlbum}
      draggable
      onDragStart={onDragStart}
      onDoubleClick={() => dispatch(addToPlaylist(item))}
    >
      {get(item, "metadata.title", item.name)}
    </LibraryItemContainer>
  );
};

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryItem);
