import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
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
  height: 60vh;
  padding: 64px 0 0;
  position: relative;
  background: white;
  margin: auto;
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
  right: 24px;
  color: black;
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
            {t("modal.closeButton")}
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
