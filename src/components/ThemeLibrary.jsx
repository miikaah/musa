import React, { useState, useEffect } from "react"
import ThemeBlock from "./ThemeBlock"
import { FALLBACK_THEME } from "../config"
import { updateCurrentTheme, doIdbRequest, updateStateInDb } from "../util"
import { get } from "lodash-es"
import "./ThemeLibrary.scss"

const ThemeLibrary = ({ update }) => {
  const [themes, setThemes] = useState([])
  const [defaultTheme, setDefaultTheme] = useState({})
  const [currentTheme, setCurrentTheme] = useState({})

  useEffect(() => {
    doIdbRequest({
      method: "get",
      storeName: "state",
      key: "state",
      onReqSuccess: req => () =>
        setDefaultTheme(get(req, "result.defaultTheme", FALLBACK_THEME))
    })
  }, [])

  useEffect(() => {
    doIdbRequest({
      method: "getAll",
      storeName: "theme",
      onReqSuccess: req => () => setThemes(req.result)
    })

    doIdbRequest({
      method: "get",
      storeName: "state",
      key: "state",
      onReqSuccess: req => () =>
        setCurrentTheme(get(req, "result.currentTheme", FALLBACK_THEME))
    })
  }, [update])

  const handleDefaultThemeChange = theme => {
    setDefaultTheme(theme)
    setCurrentTheme(theme)
    updateCurrentTheme(theme)
    doIdbRequest({
      method: "get",
      storeName: "state",
      key: "state",
      onReqSuccess: (req, db) => () =>
        updateStateInDb(req, db, { defaultTheme: theme })
    })
  }

  const handleCurrentThemeChange = theme => {
    setCurrentTheme(theme)
    updateCurrentTheme(theme)
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
        {themes &&
          themes.map((theme, i) => (
            <ThemeBlock
              key={i}
              colors={theme.colors}
              setCurrentTheme={theme => handleCurrentThemeChange(theme)}
            />
          ))}
      </div>
    </div>
  )
}

export default ThemeLibrary
