import React from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled";

const fade = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ToasterContainer = styled.div`
  position: absolute;
  bottom: 90px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  z-index: 3;
  margin-top: 0;
  pointer-events: none;
  width: 100vw;
  height: 50vh;
`;

const ToastContainer = styled.div`
  background: var(--color-primary-highlight);
  min-width: 360px;
  max-width: 360px;
  margin: 4px auto;
  border-radius: 40px;
  border: 1px solid var(--color-primary-highlight);
  animation: ${fade} 1.5s ease-out 1s forwards;
`;

const Toast = styled.div`
  color: var(--color-typography-primary);
  padding: 20px;
  text-align: center;
`;

const Toaster = ({ messages }) => {
  return (
    <ToasterContainer>
      {Object.entries(messages).map(([key, message]) => (
        <ToastContainer key={key}>
          <Toast>{message}</Toast>
        </ToastContainer>
      ))}
    </ToasterContainer>
  );
};

export default connect(
  (state) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch }),
)(Toaster);
