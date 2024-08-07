import { Colors } from "@miikaah/musa-core";
import { Dispatch } from "redux";
import { addToast, removeToast } from "./reducers/toaster.reducer";
import { AudioItem, ReplaygainType } from "./types";
import {
  REPLAYGAIN_TYPE,
  hardcodedBaseUrl,
  hardcodedLanUrl,
  isHosted,
  isLan,
} from "./config";

export const getReplaygainDb = (
  replaygainType: ReplaygainType,
  currentItem: AudioItem,
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

export const getSrc = (url: string) => {
  const maybeModifiedUrl = isLan
    ? url.replace(hardcodedBaseUrl, hardcodedLanUrl)
    : isHosted
      ? url.replace(hardcodedBaseUrl, window.origin).replace(":80", "")
      : url;

  return maybeModifiedUrl;
};

function utf8ToBase64(str: string) {
  // First we encode the string as UTF-8
  const utf8Str = encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => {
      return String.fromCharCode(("0x" + p1) as any);
    },
  );
  // Then we use btoa to encode the UTF-8 string to Base64
  return btoa(utf8Str);
}

function base64ToUtf8(base64: string) {
  // First we decode the Base64 string to a binary string
  const binaryStr = atob(base64);
  // Then we decode the binary string back to a UTF-8 string
  const utf8Str = decodeURIComponent(
    binaryStr
      .split("")
      .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return utf8Str;
}

export const urlSafeBase64 = {
  encode: (s: string): string => {
    return utf8ToBase64(s)
      .replace(/\+/g, "-") // Convert '+' to '-'
      .replace(/\//g, "_") // Convert '/' to '_'
      .replace(/=+$/, ""); // Remove ending '='
  },
  decode: (s: string): string => {
    // Append removed '=' chars
    s += Array(5 - (s.length % 4)).join("=");
    s = s
      .replace(/-/g, "+") // Convert '-' to '+'
      .replace(/_/g, "/"); // Convert '_' to '/'

    return base64ToUtf8(atob(s));
  },
};

export const noBreakSpaceChar = "\u00A0";
export const separator = `;${noBreakSpaceChar}`;
