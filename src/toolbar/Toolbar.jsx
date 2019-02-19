import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleLibrary } from "../reducers/library.reducer";
import "./Toolbar.scss";

class Toolbar extends Component {
  render() {
    return (
      <div className="toolbar">
        <button type="button" className="toolbar-toggle-settings">
          <FontAwesomeIcon icon="cog" />
        </button>
        <button
          type="button"
          className="toolbar-toggle-library"
          onClick={() => this.props.dispatch(toggleLibrary())}
        >
          <FontAwesomeIcon icon="bars" />
        </button>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Toolbar);
