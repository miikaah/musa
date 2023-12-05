import { AudioWithMetadata, Colors } from "@miikaah/musa-core";
import { Dispatch } from "redux";
import { addToast, removeToast } from "./reducers/toaster.reducer";
import { ReplaygainType } from "./types";
import { REPLAYGAIN_TYPE } from "./config";

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

export function formatDuration(dur?: number | string) {
  if (typeof dur === "string") {
    return dur;
  }

  const duration = Number(dur ?? 0);
  if (duration < 1) {
    return "0:00";
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

export function cleanUrl(url: string | undefined | unknown): string {
  if (!url) {
    return "";
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

export const isCtrlDown = (event: KeyboardEvent): boolean =>
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

const { origin } = window.location;
const isLan = origin.includes("192.168");
const hardcodedBaseUrl = import.meta.env.VITE_API_BASE_URL;
const hardcodedLanUrl = import.meta.env.VITE_API_LAN_URL;

export const getSrc = (url: string) => {
  return isLan ? url.replace(hardcodedBaseUrl, hardcodedLanUrl) : url;
};
