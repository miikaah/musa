import React, { Component } from "react";
import { connect } from "react-redux";
import { playNext } from "../reducers/player.reducer";
import { get, isNaN } from "lodash-es";
import "./Player.scss";

class Player extends Component {
  state = {
    duration: 0,
    currentTime: 0,
    volume: 50,
    seekUpdater: undefined
  };
  constructor(props) {
    super(props);
    this.player = React.createRef();
  }

  componentDidMount() {
    this.player.current.volume = this.getVolumeForAudioEl();
    this.player.current.addEventListener("loadeddata", () => {
      this.setState({
        duration: this.getDurationOrTime("duration"),
        seekUpdater: setInterval(() => {
          this.setState({ currentTime: this.getDurationOrTime("currentTime") });
        }, 1000)
      });
      this.player.current.play();
    });
    this.player.current.addEventListener("ended", () => {
      console.log("ended");
      this.props.dispatch(playNext());
    });
  }

  render() {
    return (
      <div className="player-container">
        <audio controls src={this.props.src} ref={this.player}>
          Your browser does not support the <code>audio</code> element.
        </audio>
        <div className="player">
          <button className="player-play-pause">Play</button>
          <input
            className="player-volume"
            type="range"
            min="0"
            max="100"
            value={this.state.volume}
            onChange={this.setVolume.bind(this)}
          />
          <input
            className="player-seek"
            type="range"
            min="0"
            max={this.state.duration}
            value={this.state.currentTime}
            onChange={this.seek.bind(this)}
          />
        </div>
      </div>
    );
  }

  getVolumeForAudioEl() {
    return this.state.volume / 100;
  }

  setVolume(event) {
    this.setState({ volume: event.target.value });
    this.player.current.volume = this.getVolumeForAudioEl();
  }

  getDurationOrTime(prop) {
    const duration = get(this, ["player", "current", prop], 0.0);
    return Math.floor(isNaN(duration) ? 0 : duration);
  }

  seek(event) {
    clearInterval(this.state.seekUpdater);
    this.player.current.currentTime = event.target.value;
    this.setState({
      seekUpdater: setInterval(() => {
        this.setState({ currentTime: this.getDurationOrTime("currentTime") });
      }, 10)
    });
  }
}

export default connect(
  state => ({
    src: state.player.src
  }),
  dispatch => ({ dispatch })
)(Player);
