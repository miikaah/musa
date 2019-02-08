import React, { Component } from "react";
import { connect } from "react-redux";
import {
  play,
  pause,
  playNext,
  setCurrentTime
} from "../reducers/player.reducer";
import { get, isNaN, isEmpty } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Player.scss";

class Player extends Component {
  state = {
    duration: 0,
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
          this.props.dispatch(
            setCurrentTime(this.getDurationOrTime("currentTime"))
          );
        }, 10)
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
          <button
            className="player-play-pause"
            onClick={this.playOrPause.bind(this)}
          >
            <FontAwesomeIcon icon={this.props.isPlaying ? "pause" : "play"} />
          </button>
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
            value={this.props.currentTime}
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
        this.props.dispatch(
          setCurrentTime(this.getDurationOrTime("currentTime"))
        );
      }, 10)
    });
  }

  playOrPause() {
    if (isEmpty(this.props.playlist)) return;
    if (this.props.isPlaying) {
      this.player.current.pause();
      this.props.dispatch(pause());
      return;
    }
    if (!isEmpty(this.props.src)) this.player.current.play();
    this.props.dispatch(play());
  }
}

export default connect(
  state => ({
    src: state.player.src,
    isPlaying: state.player.isPlaying,
    playlist: state.player.items,
    currentTime: state.player.currentTime
  }),
  dispatch => ({ dispatch })
)(Player);
