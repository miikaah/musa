import React from "react"
import { updateCurrentTheme } from "../util"
import "./ThemeBlock.scss"

const ThemeBlock = ({ colors, setCurrentTheme }) => {
  return (
    <div
      className="theme-block"
      style={{ backgroundColor: `rgb(${colors.bg})` }}
      onClick={() => {
        updateCurrentTheme(colors)
        setCurrentTheme(colors)
      }}
    >
      <span style={{ backgroundColor: `rgb(${colors.primary})` }} />
      <span style={{ backgroundColor: `rgb(${colors.secondary})` }} />
    </div>
  )
}

export default ThemeBlock
