import React from "react";
import styled from "styled-components";
import { ellipsisTextOverflow } from "../common.styles";

const Container = styled.div<{ top: number; dock: string; maxWidth: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  ${({ dock }) => (dock === "left" ? "left: 0" : "right: 0")};
  padding: 5px 0 5px 10px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  max-width: ${({ maxWidth }) => maxWidth && maxWidth}px;
  max-height: 60vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #fff;
  color: #000;
  border: 1px solid #000;

  > * {
    min-height: 20px;
    max-height: 20px;
    ${ellipsisTextOverflow}

    &:hover {
      background: var(--color-primary-highlight);
      color: var(--color-typography-primary);
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    max-width: 100%;
    max-height: 25vh;
  }
`;

const Select = ({ showSelect, top = 0, maxWidth, dock = "left", children }) => {
  return showSelect ? (
    <Container top={top} maxWidth={maxWidth} dock={dock}>
      {children}
    </Container>
  ) : null;
};

export default Select;
