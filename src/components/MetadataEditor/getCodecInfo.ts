import { AudioWithMetadata } from "@miikaah/musa-core";

export const getCodecInfo = (file: AudioWithMetadata) => {
  const { codec, codecProfile, container } = file?.metadata || {};

  let str = "";
  if (codec) {
    str += codec;
    str += ", ";
  }
  if (codecProfile) {
    str += codecProfile;
    str += ", ";
  }
  if (container) {
    str += container;
  }

  return str?.replace("MPEG 1 Layer 3", "MP3");
};
