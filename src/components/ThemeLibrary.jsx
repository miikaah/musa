import React, { useState, useEffect } from "react"
import ThemeBlock from "./ThemeBlock"
import { DB_NAME, DB_VERSION } from "../config"
import "./ThemeLibrary.scss"

const ThemeLibrary = () => {
  const [themes, setThemes] = useState([])

  useEffect(() => {
    const onThemeStoreReqSuccess = themeStoreReq => {
      return () => setThemes(themeStoreReq.result)
    }

    const onIdbSuccess = idbEvent => {
      const db = idbEvent.target.result
      const themeStore = db
        .transaction("theme", "readwrite")
        .objectStore("theme")

      const themeStoreReq = themeStore.getAll()
      themeStoreReq.onsuccess = onThemeStoreReqSuccess(themeStoreReq)
    }

    const idbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    idbRequest.onsuccess = onIdbSuccess
  }, [])

  return (
    <div className="theme-library">
      {themes.map((theme, i) => (
        <ThemeBlock key={i} colors={theme.colors} />
      ))}
    </div>
  )
}

export default ThemeLibrary
