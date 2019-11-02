import React from "react";
import styled from "styled-components/macro";

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

const Button = ({ className, children, onClick, ...rest }) => (
  <ButtonContainer
    className={className}
    type="button"
    onClick={onClick}
    {...rest}
  >
    {children}
  </ButtonContainer>
);

export default Button;
