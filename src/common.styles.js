import styled, { css } from "styled";

export const ellipsisTextOverflow = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const listOverflow = css`
  min-height: 89vh;
  max-height: 89vh;
  overflow-y: auto;

  @media (max-height: 900px) {
    min-height: 86vh;
    max-height: 86vh;
  }

  @media (max-height: 800px) {
    min-height: 84vh;
    max-height: 84vh;
  }

  @media (max-height: 600px) {
    min-height: 80vh;
    max-height: 80vh;
  }

  @media (max-height: 550px) {
    min-height: 77vh;
    max-height: 77vh;
  }
`;

export const ArrowDown = styled.span`
  cursor: pointer;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--color-typography-primary);
`;

export const listImage = css`
  > div:first-of-type {
    display: flex;
    min-width: 80px;
    min-height: 80px;
    align-items: flex-start;
    justify-content: center;

    > img {
      max-width: 80px;
      max-height: 80px;
      box-shadow: 0 2px 4px rgb(0 0 0 / 30%);

      ${({ hasCover }) =>
        !hasCover &&
        `
        min-width: 80px;
        min-height: 80px;
        background-color: #d7d7d7;
      `}
    }
  }
`;

export const cardActionShadow = css`
  box-shadow: 0 2px 9px -2px rgb(0 0 0 / 30%);
`;
