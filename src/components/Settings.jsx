import React from "react"
import { connect } from "react-redux"
import ThemeLibrary from "./ThemeLibrary"
import ReplaygainSetting from "./ReplaygainSetting"
import "./Settings.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const Settings = ({ isVisible }) => {
  return (
    <>
      <h1>Settings</h1>
      <div className="settings-block">
        <h3>Theme</h3>
        <ThemeLibrary update={isVisible} />
      </div>
      <div className="settings-block">
        <h3>Replaygain</h3>
        <ReplaygainSetting />
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
    </>
  )
}

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Settings)
