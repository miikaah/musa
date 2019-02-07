import React, { Component } from 'react'
import { get, isNaN } from 'lodash-es'
import './Player.scss'

class Player extends Component {
  state = {
    duration: 0,
    currentTime: 0,
    volume: 50,
    seekUpdater: undefined
  }
  constructor(props) {
    super(props)
    this.player = React.createRef()
  }

  componentDidMount() {
    this.player.current.volume = this.getVolumeForAudioEl()
    this.player.current.addEventListener("loadeddata", () => {
      this.setState({
        duration: this.getDurationOrTime('duration'),
        seekUpdater: setInterval(() => {
          this.setState({ currentTime: this.getDurationOrTime('currentTime') })
        }, 1000)
      })
      this.player.current.play()
    })

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
            >
            </input>
          <input
            className="player-seek"
            type="range"
            min="0"
            max={this.state.duration}
            value={this.state.currentTime}
            onChange={this.seek.bind(this)}
          >
          </input>
        </div>
      </div>
    )
  }

  getVolumeForAudioEl() {
    return this.state.volume / 100
  }

  setVolume(event) {
    this.setState({ volume: event.target.value })
    this.player.current.volume = this.getVolumeForAudioEl()
  }

  getDurationOrTime(prop) {
    const duration = get(this, ['player', 'current', prop], 0.0)
    return Math.floor(isNaN(duration) ? 0 : duration)
  }

  seek(event) {
    console.log(event.target.value, this.player.current.currentTime)
    clearInterval(this.state.seekUpdater)
    this.player.current.currentTime = event.target.value
    this.setState({
      seekUpdater: setInterval(() => {
        this.setState({ currentTime: this.getDurationOrTime('currentTime') })
      }, 10)
    })
  }
}

export default Player
