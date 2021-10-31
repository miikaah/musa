import { keyframes } from "styled-components/macro";

export const fadeIn = keyframes`
  from {
    opacity: 0.666;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.1;
  }
`;

export const expandHeight = (albumsLen, filesLen) => keyframes`
  from {
    height: 23px;
  }
  to {
    height: ${23 + albumsLen * 74 + filesLen * 17}px;
  }
`;

export const contractHeight = (albumsLen, filesLen) => keyframes`
  from {
    height: ${23 + albumsLen * 74 + filesLen * 17}px;
  }
  to {
    height: 23px;
  }
`;
