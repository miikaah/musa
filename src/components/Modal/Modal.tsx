import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";

const Container = styled.div<{ top?: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
`;

const Wrapper = styled.div<{ top?: number }>`
  width: 90vw;
  height: 70vh;
  padding: 64px 0 0;
  position: relative;
  background: white;
  margin: auto;
  max-width: 1080px;
  max-height: 736px;

  box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.333);
`;

const Title = styled.p`
  font-size: var(--font-size-xs);
  position: absolute;
  top: 20px;
  left: 20px;
  color: black;
  margin: 0;

  > span:nth-of-type(2) {
    font-size: var(--font-size-xxs);
    color: grey;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 9px;
  padding: 10px;
  background-color: var(--color-secondary-highlight);
  color: var(--color-typography-secondary);

  > span:nth-of-type(2) {
    margin: 0 8px;
  }
`;

type ModalProps = {
  modalTitleTranslationKey: string;
  closeModal: () => void;
  children: React.ReactNode;
  t: TranslateFn;
  top?: number;
};

const Modal = ({
  modalTitleTranslationKey,
  closeModal,
  children,
  t,
}: ModalProps) => {
  return (
    <Container>
      <Wrapper>
        <Title>
          <span>{t(modalTitleTranslationKey)} </span>
          <span>(EBU R128)</span>
        </Title>
        {closeModal && (
          <CloseButton onClick={closeModal}>
            <span>X</span>
            <span>|</span>
            <span>{t("modal.closeButton")}</span>
          </CloseButton>
        )}
        {children}
      </Wrapper>
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(Modal);
