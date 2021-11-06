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
    max-height: 23px;
  }
  to {
    max-height: ${23 + albumsLen * 100 + expandHeightFiles(filesLen)}px;
  }
`;

export const expandHeightFiles = (filesLen) => 100 + filesLen * 17;

export const expandHeightAlbum = (songsLen) => keyframes`
  from {
    max-height: 100px;
  }
  to {
    max-height: ${40 + 100 + expandHeightFiles(songsLen)}px;
  }
`;

export const contractHeight = (albumsLen, filesLen) => keyframes`
  from {
    max-height: ${23 + albumsLen * 100 + expandHeightFiles(filesLen)}px;
  }
  to {
    max-height: 23px;
  }
`;

export const contractHeightAlbum = (songsLen) => keyframes`
  from {
    max-height: ${40 + 100 + expandHeightFiles(songsLen)}px;
  }
  to {
    max-height: 100px;
  }
`;
