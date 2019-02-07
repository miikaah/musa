import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addToPlaylist } from '../reducers/playlist.reducer'
import './LibraryItem.scss'

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

class LibraryItem extends Component {
  render() {
    const name = this.props.item.name.toString()
    // const path = this.props.item.path.toString()
    return (
      <li
        key={name + "-" + Date.now()} className="library-item"
        onDoubleClick={() => this.props.dispatch(addToPlaylist(this.props.item))}
      >
        {name}
      </li>
    )
  }

  playSong = path => {
    console.log(path)
    ipcRenderer.send("getSongAsDataUrl", path)
  }
}

const mapState = state => ({})

const mapDispatch = dispatch => ({ dispatch })

export default connect(
  mapState,
  mapDispatch
)(LibraryItem)
