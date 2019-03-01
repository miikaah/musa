import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleLibrary } from "../reducers/library.reducer";
import Player from "../player/Player";
import "./Toolbar.scss";

class Toolbar extends Component {
  render() {
    return (
      <div className="toolbar">
        <button
          type="button"
          className="toolbar-toggle-library toolbar-button"
          onClick={() => this.props.dispatch(toggleLibrary())}
        >
          <FontAwesomeIcon icon="bars" />
        </button>
        <Player />
        <button
          type="button"
          className="toolbar-toggle-settings toolbar-button"
        >
          <FontAwesomeIcon icon="cog" />
        </button>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Toolbar);
