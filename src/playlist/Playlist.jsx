import React, { Component } from "react"
import { connect } from 'react-redux'
import PlaylistItem from './PlaylistItem'
import "./Playlist.scss"

class Playlist extends Component {
  render() {
    console.log(this.props.playlist)
    return (
      <ul className="playlist">
        {
          this.props.playlist
            .map(item =>
              <PlaylistItem
                key={item.name.toString() + "-" + Date.now()}
                item={item}
              />
            )
        }
      </ul>
    )
  }
}

const mapState = state => ({
  playlist: state.playlist.items
})

export default connect(
  mapState
)(Playlist)
