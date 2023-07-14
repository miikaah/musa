import React from "react";
import { css } from "styled-components/macro";
import { cleanUrl } from "../../util";
import { fadeIn } from "animations";
import { styledWithPropFilter } from "styledWithPropFilter";

const Image = styledWithPropFilter("img")`
  animation: ${({ animate }) =>
    animate
      ? css`
          ${fadeIn} 0.2s
        `
      : "none"};
  object-fit: scale-down;
`;

const getFileType = (audioOrAlbum) => {
  return (
    audioOrAlbum?.metadata?.codec ||
    (audioOrAlbum.files || [])[0]?.metadata?.codec ||
    "mpeg"
  );
};

const AlbumImage = ({ item, animate = true }) => {
  const type = getFileType(item);
  const isMp3 = type.toLowerCase().startsWith("mpeg");
  const isFlac = type.toLowerCase().startsWith("flac");
  const src = item.coverUrl
    ? cleanUrl(item.coverUrl)
    : isMp3
    ? "musa-placeholder-icon-mp3.png"
    : isFlac
    ? "musa-placeholder-icon-flac.png"
    : "musa-placeholder-icon-ogg.png";

  return <Image alt="" animate={animate} src={src} />;
};

export default AlbumImage;
