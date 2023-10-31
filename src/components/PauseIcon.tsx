import React from "react";
import styled from "styled-components";

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  > div {
    width: ${({ isSmall }) => (isSmall ? "3px" : "4px")};
    height: ${({ isSmall }) => (isSmall ? "10px" : "18px")};
    margin-right: ${({ isSmall }) => (isSmall ? "2px" : "4px")};
    background-color: var(--color-typography-primary);
  }
`;

const PauseIcon = (props) => (
  <Icon {...props}>
    <div />
    <div />
  </Icon>
);

export default PauseIcon;
