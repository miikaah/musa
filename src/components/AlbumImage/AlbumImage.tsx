import {
  AlbumWithFilesAndMetadata,
  Artist,
  AudioWithMetadata,
} from "@miikaah/musa-core";
import React from "react";
import styled, { css } from "styled-components";
import { cleanUrl, getSrc } from "../../util";
import { fadeIn } from "../../animations";

const Image = styled.img<{ animate: boolean }>`
  animation: ${({ animate }) =>
    animate
      ? css`
          ${fadeIn} 0.2s
        `
      : "none"};
  object-fit: scale-down;
`;

const hasMetadata = (audio: AlbumItem): audio is AudioWithMetadata => {
  return "metadata" in audio;
};

const hasFiles = (album: AlbumItem): album is AlbumWithFilesAndMetadata => {
  return "files" in album;
};

const getFileType = (audioOrAlbum: AlbumItem) => {
  let fileType: string | undefined;

  if (hasMetadata(audioOrAlbum)) {
    fileType = audioOrAlbum?.metadata?.codec;
  }

  if (hasFiles(audioOrAlbum)) {
    fileType = (audioOrAlbum.files || [])[0]?.metadata?.codec;
  }

  return fileType || "mpeg";
};

type AlbumItem =
  | AudioWithMetadata
  | AlbumWithFilesAndMetadata
  | Artist["albums"][0];

type AlbumImageProps = {
  item: AlbumItem | undefined;
  animate?: boolean;
};

const AlbumImage = ({ item, animate = true }: AlbumImageProps) => {
  if (!item) {
    return null;
  }

  const type = getFileType(item);
  const isMp3 = type.toLowerCase().startsWith("mpeg");
  const isFlac = type.toLowerCase().startsWith("flac");
  const src = item.coverUrl
    ? // HACK: To fix Electron mangling the beginning of the request url
      cleanUrl(item.coverUrl.replace("media:/", "media:///"))
    : isMp3
    ? "musa-placeholder-icon-mp3.png"
    : isFlac
    ? "musa-placeholder-icon-flac.png"
    : "musa-placeholder-icon-ogg.png";

  return <Image alt="Album image" animate={animate} src={getSrc(src)} />;
};

export default AlbumImage;
