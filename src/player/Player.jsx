import React, { Component } from "react";
import { connect } from "react-redux";
import {
  play,
  pause,
  playNext,
  setCurrentTime
} from "../reducers/player.reducer";
import { get, isNaN, isEmpty, isNumber, isNull, defaultTo } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KEYS } from "../util";
import "./Player.scss";

const VOLUME_DEFAULT = 50;
const VOLUME_MUTED = 0;
const VOLUME_STEP = 5;
const SEEK_REFRESH_RATE = 500;

class Player extends Component {
  state = {
    duration: 0,
    volume: VOLUME_DEFAULT,
    volumeBeforeMuting: VOLUME_DEFAULT,
    isMuted: () => this.state.volume === VOLUME_MUTED,
    seekUpdater: undefined,
    titleUpdater: undefined
  };

  constructor(props) {
    super(props);
    this.player = React.createRef();
    this.cover = React.createRef();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      case KEYS.Space:
        this.playOrPause();
        event.preventDefault();
        return;
      case KEYS.M:
        this.muteOrUnmute();
        return;
      default:
        break;
    }
  };

  componentDidMount() {
    this.setVolume({
      target: {
        value: defaultTo(localStorage.getItem("volume"), VOLUME_DEFAULT)
      }
    });

    this.player.current.addEventListener("loadeddata", () => {
      this.setRealVolume();
      this.setState({
        duration: this.getDurationOrTime("duration"),
        seekUpdater: setInterval(() => {
          this.props.dispatch(
            setCurrentTime(this.getDurationOrTime("currentTime"))
          );
        }, SEEK_REFRESH_RATE)
      });
      this.player.current.play();
      this.setDocumentTitle();
    });

    this.player.current.addEventListener("ended", () => {
      this.setState({
        titleUpdater: setTimeout(() => (document.title = "Musa"), 2000)
      });
      this.props.dispatch(playNext());
    });
  }

  setDocumentTitle() {
    const metadata = get(this.props, "currentItem.metadata", null);
    if (isNull(metadata)) return;
    clearTimeout(this.state.titleUpdater);
    document.title = `${metadata.artist} - [${metadata.album} #${
      metadata.track
    }] - ${metadata.title} [Musa]`;
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
          <button
            className="player-volume-btn"
            onClick={this.muteOrUnmute.bind(this)}
          >
            <FontAwesomeIcon
              icon={
                this.state.volume > VOLUME_STEP - 1
                  ? "volume-up"
                  : "volume-mute"
              }
            />
          </button>
          <input
            className="player-volume"
            type="range"
            min="0"
            max="100"
            step={VOLUME_STEP}
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
    return vol < 0.02 ? VOLUME_MUTED : vol;
  }

  setRealVolume(v) {
    const vol = isNumber(v) ? v : this.state.volume;
    const trackGainPercentage = Math.pow(
      10,
      this.getReplaygainTrackGainDb() / 20
    );
    const realVolume = Math.min(
      100,
      Math.max(1, vol * parseFloat(trackGainPercentage))
    );
    this.player.current.volume = this.getVolumeForAudioEl(realVolume);
  }

  setVolume(event) {
    const vol = parseInt(event.target.value, 10);
    const volume = vol === VOLUME_STEP ? VOLUME_MUTED : vol;
    this.setState({ volume });
    this.setRealVolume(volume);
    localStorage.setItem("volume", volume);
  }

  getReplaygainTrackGainDb() {
    const dbString = get(
      this.props.currentItem,
      "metadata.replaygainTrackGain",
      ""
    ).replace(/ dB+/, "");
    return parseFloat(!isEmpty(dbString) ? dbString : 0);
  }

  getDurationOrTime(prop) {
    const duration = get(this, ["player", "current", prop], 0);
    return Math.floor(isNaN(duration) ? 0 : duration);
  }

  seek(event) {
    clearInterval(this.state.seekUpdater);
    this.player.current.currentTime = event.target.value;
    this.setSeekUpdater();
  }

  playOrPause() {
    if (isEmpty(this.props.playlist)) return;
    if (this.props.isPlaying) {
      this.player.current.pause();
      this.props.dispatch(pause());
      clearInterval(this.state.seekUpdater);
      return;
    }
    if (!isEmpty(this.props.src)) {
      // BUGFIX: pause->play starting from beginning
      this.player.current.currentTime = this.props.currentTime;
      this.player.current.play();
      this.props.dispatch(play());
      this.setSeekUpdater();
      return;
    }
    // Dispatch first play action
    this.props.dispatch(play());
  }

  setSeekUpdater() {
    this.setState({
      seekUpdater: setInterval(() => {
        this.props.dispatch(
          setCurrentTime(this.getDurationOrTime("currentTime"))
        );
      }, SEEK_REFRESH_RATE)
    });
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

  muteOrUnmute() {
    if (this.state.isMuted()) {
      this.setRealVolume(this.state.volumeBeforeMuting);
      this.setState({ volume: this.state.volumeBeforeMuting });
      return;
    }
    this.setRealVolume(VOLUME_MUTED);
    this.setState({
      volume: VOLUME_MUTED,
      volumeBeforeMuting: this.state.volume
    });
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
