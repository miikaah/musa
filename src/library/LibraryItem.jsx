import React, { Component } from "react";
import { connect } from "react-redux";
import { addToPlaylist } from "../reducers/player.reducer";
import "./LibraryItem.scss";

class LibraryItem extends Component {
  render() {
    const name = this.props.item.name.toString();
    return (
      <li
        key={name + "-" + Date.now()}
        className="library-item"
        onDoubleClick={() =>
          this.props.dispatch(addToPlaylist(this.props.item))
        }
      >
        {name}
      </li>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryItem);
