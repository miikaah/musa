import React from "react"
import { connect } from "react-redux"
import ThemeLibrary from "./ThemeLibrary"
import "./Settings.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const Settings = ({ isSettingsVisible }) => (
  <div className="settings">
    <h1>Settings</h1>
    <div className="settings-block">
      <h3>Theme</h3>
      <ThemeLibrary update={isSettingsVisible} />
    </div>
    <div className="settings-block">
      <h3>Advanced</h3>
      <button
        className="btn btn-primary"
        onClick={() => ipcRenderer.send("runInitialScan")}
      >
        Re-run initial scan
      </button>
    </div>
  </div>
)

export default connect(
  state => ({
    isSettingsVisible: state.settings.isVisible
  }),
  dispatch => ({ dispatch })
)(Settings)
