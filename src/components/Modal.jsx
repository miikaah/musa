import React from "react";
import styled from "styled-components/macro";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 90vh;
  background: var(--color-bg);
  position: fixed;
  top: var(--titlebar-height);
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

const Modal = ({ filesToEdit, closeModal, children, maxWidth }) => {
  return (
    <Container maxWidth={maxWidth}>
      <CloseButton onClick={closeModal}>Close</CloseButton>
      {children}
    </Container>
  );
};

export default Modal;
