import React from "react"
import { updateThemeCssVars } from "../util"
import "./ThemeBlock.scss"

const ThemeBlock = ({ colors }) => {
  return (
    <div
      className="theme-block"
      style={{ backgroundColor: `rgb(${colors.bg})` }}
      onClick={() => updateThemeCssVars(colors)}
    >
      <span style={{ backgroundColor: `rgb(${colors.primary})` }} />
      <span style={{ backgroundColor: `rgb(${colors.secondary})` }} />
    </div>
  )
}

export default ThemeBlock
