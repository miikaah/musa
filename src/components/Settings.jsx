import React from "react"
import { connect } from "react-redux"
import "./Settings.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const Settings = () => (
  <div className="settings-wrapper">
    <h1>Settings</h1>
    <button
      className="btn btn-primary"
      onClick={() => ipcRenderer.send("runInitialScan")}
    >
      Re-run initial scan
    </button>
  </div>
)

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Settings)
