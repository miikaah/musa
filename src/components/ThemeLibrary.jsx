import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import ThemeBlock from "./ThemeBlock"
import { FALLBACK_THEME } from "../config"
import { doIdbRequest, updateCurrentTheme } from "../util"
import { updateSettings } from "../reducers/settings.reducer"
import "./ThemeLibrary.scss"

const ThemeLibrary = ({ defaultTheme, currentTheme, update, dispatch }) => {
  const [themes, setThemes] = useState([])

  useEffect(() => {
    doIdbRequest({
      method: "getAll",
      storeName: "theme",
      onReqSuccess: req => () => setThemes(req.result)
    })
  }, [update])

  const handleDefaultThemeChange = theme => {
    updateCurrentTheme(theme)
    dispatch(updateSettings({ defaultTheme: theme, currentTheme: theme }))
  }

  const handleCurrentThemeChange = theme => {
    updateCurrentTheme(theme)
    dispatch(updateSettings({ currentTheme: theme }))
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

export default connect(
  state => ({
    defaultTheme: state.settings.defaultTheme,
    currentTheme: state.settings.currentTheme
  }),
  dispatch => ({ dispatch })
)(ThemeLibrary)
