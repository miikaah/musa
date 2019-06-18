import React, { useState, useEffect } from "react"
import ThemeBlock from "./ThemeBlock"
import { DB_NAME, DB_VERSION, FALLBACK_THEME } from "../config"
import { updateCurrentTheme } from "../util"
import "./ThemeLibrary.scss"

const ThemeLibrary = ({ update }) => {
  const [themes, setThemes] = useState([])

  const defaultThm =
    JSON.parse(localStorage.getItem("musaDefaultTheme")) || FALLBACK_THEME
  const [defaultTheme, setDefaultTheme] = useState(defaultThm)
  const [currentTheme, setCurrentTheme] = useState(defaultThm)

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

    setCurrentTheme(
      JSON.parse(localStorage.getItem("musaCurrentTheme")) || FALLBACK_THEME
    )
  }, [update])

  const handleDefaultThemeChange = theme => {
    setDefaultTheme(theme)
    setCurrentTheme(theme)
    updateCurrentTheme(theme)
    localStorage.setItem("musaDefaultTheme", JSON.stringify(theme))
  }

  return (
    <div className="theme-library">
      <div className="theme-library-container">
        <div className="theme-library-default">
          <h5>Default theme</h5>
          <div className="theme-library-default-controls">
            <div className="theme-library-list">
              <ThemeBlock colors={defaultTheme} />
            </div>
            <div className="theme-library-controls">
              <button
                type="button"
                className="btn-small btn-secondary"
                onClick={() => handleDefaultThemeChange(FALLBACK_THEME)}
              >
                Set to factory default
              </button>
            </div>
          </div>
        </div>

        <div className="theme-library-current">
          <h5>Current theme</h5>
          <div className="theme-library-default-controls">
            <div className="theme-library-list">
              <ThemeBlock colors={currentTheme} />
            </div>
            <div className="theme-library-controls">
              <button
                type="button"
                className="btn-small btn-primary"
                onClick={() => handleDefaultThemeChange(currentTheme)}
              >
                Set as default theme
              </button>
            </div>
          </div>
        </div>
      </div>

      <h5>Library</h5>
      <div className="theme-library-list">
        {themes.map((theme, i) => (
          <ThemeBlock
            key={i}
            colors={theme.colors}
            setCurrentTheme={setCurrentTheme}
          />
        ))}
      </div>
    </div>
  )
}

export default ThemeLibrary
