import React from "react";
import styled from "styled-components/macro";
import Player from "components/Player";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  width: 100%;
  min-height: var(--toolbar-height);
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  background: var(--color-bg);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px;
`;

const Toolbar = () => {
  return (
    <ToolbarContainer>
      <Player />
    </ToolbarContainer>
  );
};

export default Toolbar;
