import React, { Component } from "react"
import "./PlaylistItem.scss"

class PlaylistItem extends Component {
  render() {
    return (
      <li className="playlist-item">
        {this.props.item.name}
      </li>
    )
  }
}

export default PlaylistItem
