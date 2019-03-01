import React, { Component } from "react";
import Library from "./library/Library";
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
import { get, defaultTo } from "lodash-es";
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

class App extends Component {
  state = {
    windowWidth: 1600
  };

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth })
    );
  }

  render() {
    return (
      <div
        className="app"
        style={{
          backgroundColor: `rgb(${get(this.props.bgSwatch, "rgb", "#21252b")})`,
          color: defaultTo(this.props.color, "#fff")
        }}
      >
        <Toolbar />
        <div>
          {this.state.windowWidth > 1279 ? (
            <div className="app-wrapper">
              <div
                className={`${this.props.isLibraryVisible ? "show" : "hide"}`}
              >
                <Library />
              </div>
              <div className="app-center">
                <Cover />
              </div>
              <div className="app-right">
                <Playlist />
              </div>
            </div>
          ) : (
            <div className="app-wrapper">
              <div
                className={`${this.props.isLibraryVisible ? "show" : "hide"}`}
              >
                <Library />
              </div>
              <div className="app-center">
                <Cover />
                <Playlist />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    isLibraryVisible: state.library.isVisible,
    bgSwatch: state.palette.backgroundSwatch,
    color: state.palette.color
  }),
  dispatch => ({ dispatch })
)(App);
