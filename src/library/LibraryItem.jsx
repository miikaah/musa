import React, { Component } from 'react'
import './LibraryItem.scss'

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

class LibraryItem extends Component {
  playSong = path => {
    console.log(path)
    ipcRenderer.send("getSongAsDataUrl", path)
  }

  render() {
    const name = this.props.item.name.toString()
    const path = this.props.item.path.toString()
    return (
      <li
        key={name + "-" + Date.now()} className="library-item"
        onClick={() => this.playSong(path)}
      >
        {name}
      </li>
    )
  }
}

export default LibraryItem
