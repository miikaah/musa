import React, { Component } from "react";
import { connect } from "react-redux";
import { playItem } from "../reducers/player.reducer";
import "./PlaylistItem.scss";

class PlaylistItem extends Component {
  render() {
    return (
      <li
        className="playlist-item"
        onDoubleClick={() =>
          this.props.dispatch(playItem(this.props.item, this.props.index))
        }
      >
        {this.props.item.name}
      </li>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(PlaylistItem);
