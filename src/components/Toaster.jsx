import React from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components/macro";

const fade = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const ToasterContainer = styled.div`
  position: absolute;
  bottom: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 3;
  margin-top: 0;
  pointer-events: none;
  width: 100vw;
  height: 200px;
`;

const ToastContainer = styled.div`
  background-color: var(--color-primary-highlight);
  min-width: 30%;
  max-width: 40%;
  margin: 4px auto;
  border-radius: 20px;
  animation: ${fade} 2.5s ease-in-out 1s forwards;
`;

const Toast = styled.div`
  color: var(--color-typography-primary);
  padding: 20px;
  text-align: center;
`;

const Toaster = ({ messages }) => (
  <ToasterContainer>
    {Array.from(messages.values()).map((message, i) => (
      <ToastContainer key={i}>
        <Toast>{message.msg}</Toast>
      </ToastContainer>
    ))}
  </ToasterContainer>
);

export default connect(
  (state) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch })
)(Toaster);
