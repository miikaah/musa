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

export const rangeInput = css`
  input {
    padding: 0;
    min-width: 240px;
  }

  input[type="range"] {
    overflow: hidden;
    appearance: none;
    background-color: var(--color-slider-track);
    cursor: pointer;
  }

  input[type="range"]:focus {
    outline: none;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 10px;
    appearance: none;
    margin-top: -1px;
  }

  input[type="range"]::-webkit-slider-thumb {
    width: 4px;
    appearance: none;
    box-shadow: -10000px 0 0 10000px var(--color-slider);
  }
`;
