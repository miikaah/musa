import { css } from "styled-components/macro";

export const listOverflow = css`
  max-height: 95vh;
  overflow-y: auto;

  @media (max-height: 800px) {
    max-height: 94vh;
  }

  @media (max-height: 600px) {
    max-height: 92vh;
  }
`;
