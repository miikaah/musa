import React from "react";
import styled from "styled-components";

type ButtonContainerProps = {
  isPrimary: boolean;
  isSecondary: boolean;
  isSmall: boolean;
};

const ButtonContainer = styled.button<Partial<ButtonContainerProps>>`
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

type ButtonProps = Partial<ButtonContainerProps> & {
  children: React.ReactNode;
  onClick: Function;
  className?: string;
  disabled?: boolean;
};

const Button = ({ className, children, onClick, ...rest }: ButtonProps) => {
  return (
    <ButtonContainer
      className={className}
      type="button"
      // @ts-expect-error onClick is completely generic
      onClick={onClick}
      {...rest}
    >
      {children}
    </ButtonContainer>
  );
};

export default Button;