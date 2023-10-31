import { AudioWithMetadata } from "@miikaah/musa-core";
import { Dispatch } from "redux";
import { addToast, removeToast } from "./reducers/toaster.reducer";
import { Colors, ReplaygainKey, ReplaygainType } from "./types";

export const KEYS = {
  Backspace: 8,
  Enter: 13,
  Space: 32,
  Up: 38,
  Down: 40,
  Delete: 46,
  A: 65,
  C: 67,
  D: 68,
  F: 70,
  M: 77,
  V: 86,
  X: 88,
};

export const REPLAYGAIN_TYPE: Record<ReplaygainKey, ReplaygainType> = {
  Track: "track",
  Album: "album",
  Off: "off",
};

export const getReplaygainDb = (
  replaygainType: ReplaygainType,
  currentItem: AudioWithMetadata,
) => {
  const hasTrackGain = currentItem?.metadata?.replayGainTrackGain;
  const trackGain = currentItem?.metadata?.replayGainTrackGain?.dB;
  const hasAlbumGain = currentItem?.metadata?.replayGainAlbumGain;
  const albumGain = currentItem?.metadata?.replayGainAlbumGain?.dB;

  if (replaygainType === REPLAYGAIN_TYPE.Track) {
    return hasTrackGain ? trackGain : hasAlbumGain ? albumGain : 0;
  }
  if (replaygainType === REPLAYGAIN_TYPE.Album) {
    return hasAlbumGain ? albumGain : hasTrackGain ? trackGain : 0;
  }

  return 0;
};

export function formatDuration(duration: number) {
  if (duration < 1) {
    return "0:00";
  }
  if (typeof duration === "string") {
    return duration;
  }

  let output = "";
  if (duration >= 3600) {
    output += prefixNumber(Math.floor(duration / 3600)) + ":";
    output +=
      prefixNumber(Math.floor((Math.floor(duration) % 3600) / 60)) + ":";
  } else {
    output += Math.floor((Math.floor(duration) % 3600) / 60) + ":";
  }

  output += prefixNumber(Math.floor(duration % 60));

  return output;
}

export function prefixNumber(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function cleanUrl(url: string | undefined | unknown) {
  if (!url) {
    return url;
  }
  if (typeof url !== "string") {
    return "";
  }
  return url.replace(/#/g, "%23");
}

export function updateCurrentTheme(colors: Colors) {
  document.body.style.setProperty("--color-bg", `rgb(${colors.bg})`);
  document.body.style.setProperty(
    "--color-primary-highlight",
    `rgb(${colors.primary})`,
  );
  document.body.style.setProperty(
    "--color-secondary-highlight",
    `rgb(${colors.secondary})`,
  );
  document.body.style.setProperty("--color-slider", `rgb(${colors.slider})`);
  document.body.style.setProperty("--color-typography", colors.typography);
  document.body.style.setProperty(
    "--color-typography-ghost",
    colors.typographyGhost,
  );
  document.body.style.setProperty(
    "--color-typography-primary",
    colors.typographyPrimary,
  );
  document.body.style.setProperty(
    "--color-typography-secondary",
    colors.typographySecondary,
  );
}

export function dispatchToast(msg: string, key: string, dispatch: Dispatch) {
  dispatch(addToast(msg, key));
  setTimeout(() => dispatch(removeToast(key)), 3050);
}

export const isCtrlDown = (event: KeyboardEvent) =>
  event.ctrlKey || event.metaKey;

type QueryAsObject = {
  pl?: string;
  [x: string]: unknown;
};

export const getQueryStringAsObject = (url: string): QueryAsObject => {
  const query = url.split("?").pop();

  if (!query) {
    return {};
  }

  return query.split("&").reduce((acc, v) => {
    const [key, value] = v.split("=");

    return {
      ...acc,
      [key]: value,
    };
  }, {});
};
