import React, { Component } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import { addToPlaylist } from "../reducers/player.reducer";
import "./LibraryItem.scss";

class LibraryItem extends Component {
  render() {
    const item = this.props.item;
    const name = item.name;
    return (
      <li
        key={name + "-" + Date.now()}
        className="library-item"
        onDoubleClick={() => this.props.dispatch(addToPlaylist(item))}
      >
        {get(item, "metadata.title", item.name)}
      </li>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryItem);
