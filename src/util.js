import { get, isEmpty } from "lodash-es";
import { DB_NAME, DB_VERSION } from "./config";
import {
  addToast,
  animateToast,
  removeToast
} from "./reducers/toaster.reducer";

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
  X: 88
};

export const REPLAYGAIN_TYPE = {
  Track: "track",
  Album: "album",
  Off: "off"
};

const getReplaygainTrackGainDb = currentItem => {
  const dbString = get(currentItem, "metadata.replaygainTrackGain", "").replace(
    / dB+/,
    ""
  );
  return parseFloat(!isEmpty(dbString) ? dbString : 0);
};

const getReplaygainAlbumGainDb = currentItem => {
  const dbString = get(currentItem, "metadata.replaygainAlbumGain", "").replace(
    / dB+/,
    ""
  );
  return parseFloat(
    !isEmpty(dbString) ? dbString : getReplaygainTrackGainDb(currentItem)
  );
};

export const getReplaygainDb = (replaygainType, currentItem) => {
  switch (replaygainType) {
    case REPLAYGAIN_TYPE.Album: {
      return getReplaygainAlbumGainDb(currentItem);
    }
    case REPLAYGAIN_TYPE.Off: {
      return 0;
    }
    default:
      return getReplaygainTrackGainDb(currentItem);
  }
};

export function formatDuration(duration) {
  if (duration < 1) return "0:00";
  let output = "";
  if (duration >= 3600) {
    output += prefixNumber(Math.floor(duration / 3600)) + ":";
    output +=
      prefixNumber(Math.floor((Math.floor(duration) % 3600) / 60)) + ":";
  } else output += Math.floor((Math.floor(duration) % 3600) / 60) + ":";
  output += prefixNumber(Math.floor(duration % 60));
  return output;
}

export function prefixNumber(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function getFileUri(path) {
  return `file://${path}`.replace("#", "%23");
}

export function getStateFromIdb(onReqSuccess) {
  doIdbRequest({
    method: "get",
    storeName: "state",
    key: "state",
    onReqSuccess
  });
}

export function doIdbRequest({ method, storeName, key, onReqSuccess }) {
  const idbRequest = indexedDB.open(DB_NAME, DB_VERSION);

  idbRequest.onsuccess = idbEvent => {
    const db = idbEvent.target.result;
    const store = db.transaction(storeName, "readwrite").objectStore(storeName);

    let req;

    if (key) req = store[method](key);
    else req = store[method]();

    req.onsuccess = onReqSuccess(req, db);
  };
}

export function updateIdb({ req, db, osName, key, props }) {
  db.transaction(osName, "readwrite")
    .objectStore(osName)
    .put({
      key,
      ...req.result,
      ...props
    });
}

export function updateStateInIdb(req, db, props) {
  db.transaction("state", "readwrite")
    .objectStore("state")
    .put({
      key: "state",
      ...req.result,
      ...props
    });
}

export function updateCurrentTheme(colors) {
  document.body.style.setProperty("--color-bg", `rgb(${colors.bg})`);
  document.body.style.setProperty(
    "--color-primary-highlight",
    `rgb(${colors.primary})`
  );
  document.body.style.setProperty(
    "--color-secondary-highlight",
    `rgb(${colors.secondary})`
  );
  document.body.style.setProperty("--color-slider", `rgb(${colors.slider})`);
  document.body.style.setProperty("--color-typography", colors.typography);
  document.body.style.setProperty(
    "--color-typography-primary",
    colors.typographyPrimary
  );
  document.body.style.setProperty(
    "--color-typography-secondary",
    colors.typographySecondary
  );
}

export function dispatchToast(msg, key, dispatch) {
  dispatch(addToast(msg, key));
  setTimeout(() => dispatch(animateToast(key)), 1000);
  setTimeout(() => dispatch(removeToast(key)), 3000);
}

export const isCtrlDown = event => event.ctrlKey || event.metaKey;
