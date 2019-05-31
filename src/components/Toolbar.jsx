import React from "react"
import { connect } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toggleLibrary } from "../reducers/library.reducer"
import { toggleSettings } from "../reducers/settings.reducer"
import Player from "./Player"
import "./Toolbar.scss"

const Toolbar = ({ dispatch }) => (
  <div className="toolbar">
    <button
      type="button"
      className="toolbar-toggle-library toolbar-button"
      onClick={() => dispatch(toggleLibrary())}
    >
      <FontAwesomeIcon icon="bars" />
    </button>
    <Player />
    <button
      type="button"
      className="toolbar-toggle-settings toolbar-button"
      onClick={() => dispatch(toggleSettings())}
    >
      <FontAwesomeIcon icon="cog" />
    </button>
  </div>
)

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Toolbar)
