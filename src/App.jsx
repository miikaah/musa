import React, { Component } from 'react'
import Library from './library/Library'
import Player from './player/Player'
import Playlist from './playlist/Playlist'
import './App.scss'

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

class App extends Component {
  state = {
    dataUrl: ''
  }

  componentDidMount() {
    ipcRenderer.on("songAsDataUrl", (event, dataUrl) => {
      console.log(dataUrl.length)
      this.setState({ dataUrl })
    })
  }

  render() {
    return (
      <div className="app">
        <Library />
        <Playlist />
        <Player src={this.state.dataUrl} />
      </div>
    )
  }
}

export default App
