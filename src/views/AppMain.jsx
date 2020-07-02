import React, { useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Playlist from "components/PlaylistV3";
import Cover from "components/Cover";
import { breakpoint } from "../breakpoints";
import { listOverflow } from "../common.styles";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: var(--toolbar-height);

  @media (max-width: ${breakpoint.lg}) {
    display: flex;
    flex-direction: column;
  }
`;

const AppCenter = styled.div`
  flex: 40%;
  padding: 0;

  @media (max-width: ${breakpoint.lg}) {
    flex: 100%;
    padding: 0;
    ${listOverflow}
  }
`;

const AppRight = styled.div`
  flex: 60%;
  ${listOverflow}

  @media (max-width: ${breakpoint.lg}) {
    flex: 100%;
  }
`;

const AppMain = ({ isLarge, dispatch }) => {
  const appCenterRef = useRef(null);
  const appRightRef = useRef(null);

  const onDragOver = event => event.preventDefault();

  const onDrop = event => {
    const item = JSON.parse(event.dataTransfer.getData("text"));
    if (Array.isArray(item)) {
      dispatch(pasteToPlaylist(item));
      return;
    }
    dispatch(addToPlaylist(item));
  };

  const scroll = ref => {
    ref.current &&
      ref.current.scrollTo({
        top: ref.current.scrollTop + 200,
        behavior: "smooth"
      });
  };

  const scrollPlaylist = () => {
    isLarge ? scroll(appRightRef) : scroll(appCenterRef);
  };

  const renderPlaylist = () => <Playlist onScrollPlaylist={scrollPlaylist} />;

  return (
    <AppWrapper>
      <AppCenter ref={appCenterRef} onDragOver={onDragOver} onDrop={onDrop}>
        <Cover />
        {!isLarge && renderPlaylist()}
      </AppCenter>
      {isLarge && (
        <AppRight ref={appRightRef} onDragOver={onDragOver} onDrop={onDrop}>
          {renderPlaylist()}
        </AppRight>
      )}
    </AppWrapper>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(AppMain);
