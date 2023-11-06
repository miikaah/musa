import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";

const Container = styled.div<{ maxWidth: number; top?: number }>`
  width: 100%;
  height: 100%;
  min-height: 90vh;
  background: var(--color-bg);
  position: fixed;
  top: ${({ top }) =>
    isFinite(Number(top))
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

type ModalProps = {
  closeModal: () => void;
  children: React.ReactNode;
  maxWidth: number;
  t: TranslateFn;
  top?: number;
};

const Modal = ({ closeModal, children, maxWidth, top, t }: ModalProps) => {
  return (
    <Container maxWidth={maxWidth} top={top}>
      {closeModal && (
        <CloseButton onClick={closeModal}>{t("modal.closeButton")}</CloseButton>
      )}
      {children}
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(Modal);
