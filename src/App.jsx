import React, { Component } from 'react';
import './App.scss';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    song: ''
  }

  handleChange = event => {
    this.setState({ song: event.target.value })
  }

  playSong = event => {
    ipcRenderer.send('play', this.state.song)
  }

  render() {
    return (
      <div className="app">
        <div>
          <input type="text" value={this.state.song} onChange={this.handleChange} />
          <button onClick={this.playSong}>Play</button>
        </div>
      </div>
    );
  }
}

export default App;
