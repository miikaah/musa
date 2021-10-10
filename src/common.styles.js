import { css } from "styled-components/macro";

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
