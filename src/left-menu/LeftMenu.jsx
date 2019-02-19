import React, { Component } from "react";
import { connect } from "react-redux";
import "./LeftMenu.scss";

class LeftMenu extends Component {
  render() {
    return (
      <div className="left-menu">
        <div>Playlists</div>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(LeftMenu);
