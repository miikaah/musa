import React, { Component } from "react";
import Library from "./library/Library";
import Player from "./player/Player";
import Playlist from "./playlist/Playlist";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Library />
        <Playlist />
        <Player />
      </div>
    );
  }
}

export default App;
