import React, { Component } from "react";
import { connect } from "react-redux";
import {
  play,
  pause,
  playNext,
  setCurrentTime
} from "../reducers/player.reducer";
import {
  get,
  isNaN,
  isEmpty,
  isNumber,
  defaultTo,
  sortBy,
  some
} from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  setBackgroundSwatch,
  setPrimaryHighlightSwatch,
  setSecondaryHighlightSwatch,
  setTextColor
} from "../reducers/palette.reducer";
import Palette from "img-palette";
import "./Player.scss";

const VOLUME_DEFAULT = 50;
const VOLUME_MUTED = 0;
const VOLUME_STEP = 5;
const SEEK_REFRESH_RATE = 500;

const KEYS = {
  Space: 32,
  M: 77
};

class Player extends Component {
  state = {
    duration: 0,
    volume: VOLUME_DEFAULT,
    volumeBeforeMuting: VOLUME_DEFAULT,
    isMuted: () => this.state.volume === VOLUME_MUTED,
    seekUpdater: undefined
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
      console.log("loadeddata");
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
    });
    this.player.current.addEventListener("ended", () => {
      this.props.dispatch(playNext());
    });

    this.cover.current.addEventListener("load", event => {
      const palette = new Palette(event.target);
      console.log(palette);
      const mostPopularSwatch = palette.swatches.find(
        s => s.population === palette.highestPopulation
      );
      console.log("isVibrant", this.isVibrantCover(mostPopularSwatch));
      const swatchesByPopulationDesc = sortBy(
        palette.swatches,
        s => -s.population
      );
      let bg,
        primary,
        secondary,
        color = "#fff";
      if (this.isVibrantCover(mostPopularSwatch)) {
        bg = mostPopularSwatch;
        console.log(this.contrast([255, 255, 255], bg.rgb) < 3.5);
        if (this.contrast([255, 255, 255], bg.rgb) < 3.4) color = "#000";
      } else {
        const primarySwatches = [
          defaultTo(palette.vibrantSwatch, {}),
          defaultTo(palette.lightVibrantSwatch, {}),
          defaultTo(palette.lightMutedSwatch, {})
        ];
        const secondarySwatches = [
          defaultTo(palette.mutedSwatch, {}),
          defaultTo(palette.darkMutedSwatch, {})
        ];
        const primaryPop = Math.max.apply(
          Math,
          primarySwatches.map(s => defaultTo(s.population, 0))
        );
        const secondaryPop = Math.max.apply(
          Math,
          secondarySwatches.map(s => defaultTo(s.population, 0))
        );
        bg = mostPopularSwatch;
        primary = defaultTo(
          swatchesByPopulationDesc.find(s => s.population === primaryPop),
          swatchesByPopulationDesc[1]
        );
        secondary = defaultTo(
          swatchesByPopulationDesc.find(s => s.population === secondaryPop),
          swatchesByPopulationDesc[2]
        );
      }
      console.log("ratio: ", this.contrast([255, 255, 255], bg.rgb));
      // console.log(swatchesByPopulationDesc)
      // console.log(mostPopularSwatch)
      // console.log(primary)
      // console.log(secondary)
      this.props.dispatch(setBackgroundSwatch(bg));
      this.props.dispatch(setPrimaryHighlightSwatch(primary));
      this.props.dispatch(setSecondaryHighlightSwatch(secondary));
      this.props.dispatch(setTextColor(color));
    });
  }

  isVibrantCover(mostPopularSwatch) {
    return some(mostPopularSwatch.rgb, value => value > 125);
  }

  contrast(rgb1, rgb2) {
    return (
      (this.luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) /
      (this.luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
    );
  }

  luminance(r, g, b) {
    const a = [r, g, b].map(function(v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  render() {
    return (
      <div
        className="player-container"
        style={{
          backgroundColor: `rgb(${get(this.props.swatch, "rgb", "#21252b")})`
        }}
      >
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
        <div className="player-cover-wrapper">
          <img
            alt=""
            className="player-cover"
            src={this.props.cover}
            ref={this.cover}
          />
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
      this.player.current.currentTime = this.props.currentTime; // See if this fixes pause->play starting from beginning
      this.player.current.play();
      this.props.dispatch(play());
      this.setSeekUpdater();
      return;
    }
    // Dispatch first play action that gets the song as data url from backend
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
    currentItem: state.player.currentItem,
    cover: state.player.cover,
    swatch: state.palette.backgroundSwatch
  }),
  dispatch => ({ dispatch })
)(Player);
