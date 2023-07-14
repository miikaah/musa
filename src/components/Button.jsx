import React from "react";
import styled, { StyleSheetManager } from "styled-components/macro";
import isPropValid from "@emotion/is-prop-valid";

const ButtonContainer = styled.button`
  width: 100%;
  font-size: 1rem;
  padding: 12px;
  border-radius: 3px;
  font-weight: bold;

  ${({ isSecondary }) =>
    isSecondary &&
    `
    background-color: var(--color-secondary-highlight);
    color: var(--color-typography-secondary);
  `}

  ${({ isPrimary }) =>
    isPrimary &&
    `
    background-color: var(--color-primary-highlight);
    color: var(--color-typography-primary);
  `}

  ${({ isSmall }) =>
    isSmall &&
    `
    font-size: .9rem;
    padding: 10px;
  `}
`;

const Button = ({ className, children, onClick, ...rest }) => {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <ButtonContainer
        className={className}
        type="button"
        onClick={onClick}
        {...rest}
      >
        {children}
      </ButtonContainer>
    </StyleSheetManager>
  );
};

export default Button;
