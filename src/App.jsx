import React, { Component } from "react";
import Library from "./library/Library";
import Settings from "./settings/Settings";
import Playlist from "./playlist/Playlist";
import Toolbar from "./toolbar/Toolbar";
import Cover from "./cover/Cover";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCaretRight,
  faBars,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { addToPlaylist } from "./reducers/player.reducer";
import { hideLibrary } from "./reducers/library.reducer";
import "./App.scss";

library.add(
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCaretRight,
  faBars,
  faCog
);

export const Colors = {
  Bg: "#21252b",
  Primary: "#753597",
  Secondary: "#21737e",
  Typography: "#fbfbfb",
  TypographyLight: "#000",
  DrGood: "#90ff00",
  DrMediocre: "#ffe02f",
  DrBad: "#f00"
};

class App extends Component {
  state = {
    windowWidth: 1600
  };

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth })
    );
    document.body.style.setProperty("--color-bg", Colors.Bg);
    document.body.style.setProperty(
      "--color-primary-highlight",
      Colors.Primary
    );
    document.body.style.setProperty(
      "--color-secondary-highlight",
      Colors.Secondary
    );
    document.body.style.setProperty("--color-typography", Colors.Typography);
    document.body.style.setProperty(
      "--color-typography-primary",
      Colors.Typography
    );
    document.body.style.setProperty(
      "--color-typography-secondary",
      Colors.Typography
    );
    document.body.style.setProperty("--color-dr-level", Colors.Typography);
  }

  render() {
    return (
      <div className="app">
        <Toolbar />
        <div className={`${this.props.isSettingsVisible ? "show" : "hide"}`}>
          <Settings />
        </div>
        <div>
          {this.state.windowWidth > 1279 ? (
            <div
              className={`${
                !this.props.isSettingsVisible
                  ? "app-wrapper show-flex"
                  : "app-wrapper hide"
              }`}
            >
              <div
                className={`${this.props.isLibraryVisible ? "show" : "hide"}`}
              >
                <Library />
              </div>
              <div
                className="app-center"
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                onClick={() => this.props.dispatch(hideLibrary())}
              >
                <Cover />
              </div>
              <div
                className="app-right"
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                onClick={() => this.props.dispatch(hideLibrary())}
              >
                <Playlist />
              </div>
            </div>
          ) : (
            <div
              className={`${
                !this.props.isSettingsVisible
                  ? "app-wrapper show-flex"
                  : "app-wrapper hide"
              }`}
            >
              <div
                className={`${this.props.isLibraryVisible ? "show" : "hide"}`}
              >
                <Library />
              </div>
              <div
                className="app-center"
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                onClick={() => this.props.dispatch(hideLibrary())}
              >
                <Cover />
                <Playlist />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  onDragOver = event => {
    event.preventDefault();
  };

  onDrop = event => {
    const item = JSON.parse(event.dataTransfer.getData("text"));
    if (Array.isArray(item)) {
      item.forEach(song => this.props.dispatch(addToPlaylist(song)));
      return;
    }
    this.props.dispatch(addToPlaylist(item));
  };
}

export default connect(
  state => ({
    isLibraryVisible: state.library.isVisible,
    isSettingsVisible: state.settings.isVisible
  }),
  dispatch => ({ dispatch })
)(App);
