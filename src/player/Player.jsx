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

const SPACE = 32;

class Player extends Component {
  state = {
    duration: 0,
    volume: 50,
    seekUpdater: undefined
  };

  constructor(props) {
    super(props);
    this.player = React.createRef();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      case SPACE:
        this.playOrPause();
        return false; // Return false to prevent scrolling with space bar
      default:
        break;
    }
  };

  componentDidMount() {
    this.player.current.volume = this.getVolumeForAudioEl(50);
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
      this.props.dispatch(playNext());
    });
  }

  render() {
    return (
      <div className="player-container">
        <audio controls src={this.props.src} ref={this.player} />
        <div className="player">
          <button
            className="player-play-pause"
            onClick={this.playOrPause.bind(this)}
          >
            <FontAwesomeIcon icon={this.props.isPlaying ? "pause" : "play"} />
          </button>
          <button className="player-volume-btn">
            <FontAwesomeIcon
              icon={this.state.volume > 0 ? "volume-up" : "volume-mute"}
            />
          </button>
          <input
            className="player-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={this.state.volume}
            onChange={this.setVolume.bind(this)}
          />
          <input
            className="player-seek"
            type="range"
            min="0"
            max={this.state.duration}
            step="1"
            value={this.props.currentTime}
            onChange={this.seek.bind(this)}
          />
          <span className="player-time-display">
            <span className="player-played">
              {this.formatCurrentTime(this.props.currentTime)}
            </span>
            <span> / </span>
            <span>
              {get(this.props, "currentItem.metadata.duration", "0:00")}
            </span>
          </span>
        </div>
      </div>
    );
  }

  getVolumeForAudioEl(volume) {
    const vol = volume / 100;
    return vol < 0.02 ? 0 : vol;
  }

  setVolume(event) {
    this.setState({ volume: event.target.value });
    this.player.current.volume = this.getVolumeForAudioEl(event.target.value);
  }

  getDurationOrTime(prop) {
    const duration = get(this, ["player", "current", prop], 0);
    return isNaN(duration) ? 0 : duration;
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
    if (!isEmpty(this.props.src)) {
      this.player.current.currentTime = this.props.currentTime; // See if this fixes pause->play starting from beginning
      this.player.current.play();
      this.props.dispatch(play());
      return;
    }
    // Dispatch first play action that gets the song as data url from backend
    this.props.dispatch(play());
  }

  formatCurrentTime(duration) {
    if (duration < 1) return "0:00";
    let output = "";
    if (duration >= 3600) {
      output += this.prefixNumber(Math.floor(duration / 3600)) + ":";
      output +=
        this.prefixNumber(Math.floor((Math.floor(duration) % 3600) / 60)) + ":";
    } else output += Math.floor((Math.floor(duration) % 3600) / 60) + ":";
    output += this.prefixNumber(Math.floor(duration % 60));
    return output;
  }

  prefixNumber(value) {
    return value < 10 ? `0${value}` : `${value}`;
  }
}

export default connect(
  state => ({
    src: state.player.src,
    isPlaying: state.player.isPlaying,
    playlist: state.player.items,
    currentTime: state.player.currentTime,
    currentItem: state.player.currentItem
  }),
  dispatch => ({ dispatch })
)(Player);
