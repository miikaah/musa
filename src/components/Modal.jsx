import React from "react";
import styled, { styledWithPropFilter, css } from "styled";

const Container = styledWithPropFilter("div")`
  width: 100%;
  height: 100%;
  min-height: 90vh;
  background: var(--color-bg);
  position: fixed;
  top: ${({ top }) =>
    isFinite(top)
      ? css`
          ${top}px
        `
      : "var(--titlebar-height)"};
  left: 0;
  padding: 40px;
  z-index: 2;
  max-width: ${({ maxWidth }) => maxWidth && `${maxWidth}px`};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  color: var(--color-typography);
`;

const Modal = ({ closeModal, children, maxWidth, top }) => {
  return (
    <Container maxWidth={maxWidth} top={top}>
      {closeModal && <CloseButton onClick={closeModal}>Close</CloseButton>}
      {children}
    </Container>
  );
};

export default Modal;
