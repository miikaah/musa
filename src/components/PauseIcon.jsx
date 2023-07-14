import React from "react";
import styled, { StyleSheetManager } from "styled-components/macro";
import isPropValid from "@emotion/is-prop-valid";

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
  <StyleSheetManager shouldForwardProp={isPropValid}>
    <Icon {...props}>
      <div />
      <div />
    </Icon>
  </StyleSheetManager>
);

export default PauseIcon;
