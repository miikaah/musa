import React, { Component } from "react"
import { connect } from "react-redux"
import { play } from "../reducers/player.reducer"
import "./PlaylistItem.scss"

class PlaylistItem extends Component {
  render() {
    return (
      <li
        className="playlist-item"
        onDoubleClick={() =>
          this.props.dispatch(play(this.props.item, this.props.index))
        }
      >
        {this.props.item.name}
      </li>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(PlaylistItem)
