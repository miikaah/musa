import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";

const Container = styled.div`
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

const Modal = ({ closeModal, children, maxWidth, top, t }) => {
  return (
    <Container maxWidth={maxWidth} top={top}>
      {closeModal && (
        <CloseButton onClick={closeModal}>{t("modal.closeButton")}</CloseButton>
      )}
      {children}
    </Container>
  );
};

export default connect(
  (state) => ({
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(Modal);
