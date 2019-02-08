import React, { Component } from "react";
import Library from "./library/Library";
import Player from "./player/Player";
import Playlist from "./playlist/Playlist";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./App.scss";

library.add(faPlay, faPause);

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
