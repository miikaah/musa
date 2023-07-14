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
  position: fixed;
  bottom: 0;
  left: 0;
  background: var(--color-bg);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px;

  ${({ theme }) => theme.breakpoints.down('md')} {
    padding: 4px 4px 0;
    min-height: 120px;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
  }
`;

const Toolbar = () => {
  return (
    <ToolbarContainer>
      <Player />
    </ToolbarContainer>
  );
};

export default Toolbar;
