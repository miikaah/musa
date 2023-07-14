import React from "react";
import styled from "styled";

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    width: 20px;
    height: 3px;
    margin-bottom: 4px;
    background-color: var(--color-typography);
  }
`;

const LibraryIcon = () => (
  <Icon>
    <div />
    <div />
    <div />
  </Icon>
);

export default LibraryIcon;
