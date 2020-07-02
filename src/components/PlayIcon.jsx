import React from "react";
import styled from "styled-components/macro";

const Icon = styled.div`
  ${({ isSmall }) =>
    isSmall &&
    `
    display: flex;
    justify-content: center;
    height: 100%;
  `}

  > div {
    border-top: ${({ isSmall }) => (isSmall ? "6px" : "9px")} solid transparent;
    border-bottom: ${({ isSmall }) => (isSmall ? "6px" : "9px")} solid
      transparent;
    border-left: ${({ isSmall }) => (isSmall ? "10px" : "14px")} solid
      var(--color-typography-primary);
    margin: auto;
  }
`;

const PlayIcon = props => (
  <Icon {...props}>
    <div />
  </Icon>
);

export default PlayIcon;
