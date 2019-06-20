import { DB_NAME, DB_VERSION } from "./config"

export const KEYS = {
  Backspace: 8,
  Enter: 13,
  Space: 32,
  Up: 38,
  Down: 40,
  A: 65,
  C: 67,
  D: 68,
  M: 77,
  V: 86,
  X: 88
}

export function prefixNumber(value) {
  return value < 10 ? `0${value}` : `${value}`
}

export function encodeFileUri(path) {
  return path.replace("#", "%23")
}

export function doIdbRequest({ method, storeName, key, onReqSuccess }) {
  const idbRequest = indexedDB.open(DB_NAME, DB_VERSION)

  idbRequest.onsuccess = idbEvent => {
    const db = idbEvent.target.result
    const store = db.transaction(storeName, "readwrite").objectStore(storeName)

    let req

    if (key) req = store[method](key)
    else req = store[method]()

    req.onsuccess = onReqSuccess(req, db)
  }
}

export function changeThemeInDb(req, db, propName, theme) {
  db.transaction("state", "readwrite")
    .objectStore("state")
    .put({
      key: "state",
      ...req.result,
      [propName]: theme
    })
}

export function updateCurrentTheme(colors) {
  document.body.style.setProperty("--color-bg", `rgb(${colors.bg})`)
  document.body.style.setProperty(
    "--color-primary-highlight",
    `rgb(${colors.primary})`
  )
  document.body.style.setProperty(
    "--color-secondary-highlight",
    `rgb(${colors.secondary})`
  )
  document.body.style.setProperty("--color-slider", `rgb(${colors.slider})`)
  document.body.style.setProperty("--color-typography", colors.typography)
  document.body.style.setProperty(
    "--color-typography-primary",
    colors.typographyPrimary
  )
  document.body.style.setProperty(
    "--color-typography-secondary",
    colors.typographySecondary
  )
}
