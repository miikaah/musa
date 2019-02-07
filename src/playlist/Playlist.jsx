import React, { Component } from "react"
import { connect } from "react-redux"
import PlaylistItem from "./PlaylistItem"
import "./Playlist.scss"

class Playlist extends Component {
  render() {
    return (
      <ul className="playlist">
        {this.props.playlist.map((item, index) => (
          <PlaylistItem
            key={item.name.toString() + "-" + Date.now()}
            item={item}
            index={index}
          />
        ))}
      </ul>
    )
  }
}

const mapState = state => ({
  playlist: state.player.items
})

export default connect(mapState)(Playlist)
