import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { addToPlaylist } from "reducers/player.reducer";

const Container = styled.li`
  position: relative;
`;

const Title = styled.p`
  cursor: pointer;
  padding-top: ${({ isFirstOfDisk }) => isFirstOfDisk && "12px"};
  padding-left: ${({ hasAlbum }) => (hasAlbum ? 90 : 24)}px;
  font-size: var(--font-size-xs);
  letter-spacing: -0.4px;
  margin: 0;
`;

const DiskNumber = styled.div`
  position: absolute;
  top: ${({ isFirstOfFirstDisk }) => (isFirstOfFirstDisk ? 10 : 6)}px;
  left: 26px;
  padding: 8px 9px;
  font-size: 11px;
`;

const LibraryItem = ({ item, hasAlbum, hasMultipleDisks, dispatch }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ item }));
    event.stopPropagation();
  };

  const isFirstOfDisk = new RegExp(/^\d\.01|^\d\.001|^\d\.0001/).test(
    item?.track
  );
  const isFirstOfFirstDisk = new RegExp(/^1\.01|^1\.001|^1\.0001/).test(
    item?.track
  );
  const title = item?.metadata?.title || item.name || "Unnamed file";
  const diskNo = item?.metadata?.disk?.no || "";

  return (
    <Container>
      {hasMultipleDisks && isFirstOfDisk && (
        <DiskNumber isFirstOfFirstDisk={isFirstOfFirstDisk}>
          {`${diskNo}.`}
        </DiskNumber>
      )}
      <Title
        hasAlbum={hasAlbum}
        draggable
        onDragStart={onDragStart}
        onDoubleClick={() => dispatch(addToPlaylist(item))}
        isFirstOfDisk={hasMultipleDisks && isFirstOfDisk}
      >
        {title}
      </Title>
    </Container>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch })
)(LibraryItem);
