import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { play, replay, pause, playNext } from "../reducers/player.reducer"
import { get, isNaN, isEmpty, isNumber, defaultTo } from "lodash-es"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { KEYS, prefixNumber } from "../util"
import { store } from ".."
import { Colors } from "../App.jsx"
import "./Player.scss"

const VOLUME_DEFAULT = 50
const VOLUME_MUTED = 0
const VOLUME_STEP = 5
const SEEK_REFRESH_RATE = 500

const Player = ({ playlist, isPlaying, dispatch, src, currentItem }) => {
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(
    defaultTo(parseInt(localStorage.getItem("volume"), 10), VOLUME_DEFAULT)
  )
  const [volumeBeforeMuting, setVolumeBeforeMuting] = useState(VOLUME_DEFAULT)
  const [seekUpdater, setSeekUpdater] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [prevCurrentTime, setPrevCurrentTime] = useState(0)

  const player = useRef(null)

  const isMuted = () => volume === VOLUME_MUTED

  const handleStoreChange = () => {
    const state = store.getState().player
    const shouldReplay = state.replay

    if (shouldReplay) {
      player.current.currentTime = 0
      setCurrentTime(0)

      if (!state.isPlaying) {
        // Double click has a delay in it so run this the next time
        // mixrotask queue gets emptied
        setTimeout(() => playOrPause())
      }
      dispatch(replay(false))
    }
  }

  store.subscribe(handleStoreChange)

  const getSeekUpdater = () =>
    setInterval(() => {
      setCurrentTime(player.current.currentTime)
    }, SEEK_REFRESH_RATE)

  const playOrPause = () => {
    if (isPlaying || isEmpty(playlist)) {
      player.current.pause()
      dispatch(pause())
      clearInterval(seekUpdater)
      setCurrentTime(player.current.currentTime)
      return
    }
    if (!isEmpty(src)) {
      // BUGFIX: pause->play starting from beginning
      player.current.currentTime = currentTime
      player.current.play()
      dispatch(play())
      setSeekUpdater(getSeekUpdater())
      return
    }
    // Dispatch first play action
    dispatch(play())
  }

  const getReplaygainTrackGainDb = () => {
    const dbString = get(
      currentItem,
      "metadata.replaygainTrackGain",
      ""
    ).replace(/ dB+/, "")
    return parseFloat(!isEmpty(dbString) ? dbString : 0)
  }

  const getVolumeForAudioEl = volume => {
    const vol = volume / 100
    return vol < 0.02 ? VOLUME_MUTED : vol
  }

  const setVolumeForStateAndPlayer = v => {
    const vol = isNumber(v) ? v : volume
    const trackGainPercentage = Math.pow(10, getReplaygainTrackGainDb() / 20)
    const realVolume = Math.min(
      100,
      Math.max(1, vol * parseFloat(trackGainPercentage))
    )
    player.current.volume = getVolumeForAudioEl(realVolume)
    setVolume(vol)
  }

  const muteOrUnmute = () => {
    if (isMuted()) {
      setVolumeForStateAndPlayer(volumeBeforeMuting)
      return
    }
    setVolumeBeforeMuting(volume)
    setVolumeForStateAndPlayer(VOLUME_MUTED)
  }

  const setVolumeByEvent = event => {
    const vol = parseInt(event.target.value, 10)
    const volume = vol === VOLUME_STEP ? VOLUME_MUTED : vol
    setVolumeForStateAndPlayer(volume)
    localStorage.setItem("volume", volume)
  }

  const getDuration = () => {
    const duration = get(player, "current.duration", 0)
    return Math.floor(isNaN(duration) ? 0 : duration)
  }

  const setDrLevelColor = () => {
    const dr = get(currentItem, "metadata.dynamicRange")
    if (!dr) return

    let color
    if (dr > 11) color = Colors.DrGood
    if (dr > 8 && dr < 12) color = Colors.DrMediocre
    if (dr < 9) color = Colors.DrBad
    document.body.style.setProperty("--color-dr-level", color)
  }

  useEffect(() => {
    const handleKeyDown = event => {
      switch (event.keyCode) {
        case KEYS.Space:
          playOrPause()
          event.preventDefault()
          return
        case KEYS.M:
          muteOrUnmute()
          return
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    volume,
    volumeBeforeMuting,
    playlist,
    isPlaying,
    seekUpdater,
    currentTime
  ])

  useEffect(() => {
    const handleLoadedData = event => {
      setVolumeForStateAndPlayer()
      setDuration(getDuration())
      setSeekUpdater(getSeekUpdater())
      setDrLevelColor()
      player.current.play()
    }
    const dispatchPlayNext = () => dispatch(playNext())

    player.current.addEventListener("loadeddata", handleLoadedData)
    player.current.addEventListener("ended", dispatchPlayNext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, volume, currentItem])

  const seek = event => {
    if (prevCurrentTime === event.target.value) return
    clearInterval(seekUpdater)
    player.current.currentTime = event.target.value
    setCurrentTime(event.target.value)
    setPrevCurrentTime(event.target.value)
    setSeekUpdater(getSeekUpdater())
    // Makes it possible to seek back to same spot after timeout
    // to prevent multiple seeks
    setTimeout(() => setPrevCurrentTime(-1), 500)
  }

  const formatCurrentTime = duration => {
    if (duration < 1) return "0:00"
    let output = ""
    if (duration >= 3600) {
      output += prefixNumber(Math.floor(duration / 3600)) + ":"
      output +=
        prefixNumber(Math.floor((Math.floor(duration) % 3600) / 60)) + ":"
    } else output += Math.floor((Math.floor(duration) % 3600) / 60) + ":"
    output += prefixNumber(Math.floor(duration % 60))
    return output
  }

  const renderDrGauge = () => {
    const dr = get(currentItem, "metadata.dynamicRange", "")
    let className = "player-dynamic-range-wrapper"
    if (isEmpty(dr)) className += " hidden"
    return (
      <span className={className}>
        <span className="player-dynamic-range">
          {isEmpty(dr) ? "DR00" : `DR${prefixNumber(dr)}`}
        </span>
      </span>
    )
  }

  return (
    <div className="player-container">
      <audio controls src={src} ref={player} />
      <div className="player">
        <button className="player-play-pause" onClick={playOrPause}>
          <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} />
        </button>
        <button className="player-volume-btn" onClick={muteOrUnmute}>
          <FontAwesomeIcon
            icon={volume > VOLUME_STEP - 1 ? "volume-up" : "volume-mute"}
          />
        </button>
        <input
          className="player-volume"
          type="range"
          min="0"
          max="100"
          step={VOLUME_STEP}
          value={volume}
          onChange={setVolumeByEvent}
        />
        <input
          className="player-seek"
          type="range"
          min="0"
          max={duration}
          step="1"
          value={currentTime}
          onChange={seek}
        />
        <span className="player-time-display">
          <span className="player-played">
            {formatCurrentTime(currentTime)}
          </span>
          <span> / </span>
          <span>{get(currentItem, "metadata.duration", "0:00")}</span>
        </span>
        {renderDrGauge()}
      </div>
    </div>
  )
}

export default connect(
  state => ({
    src: state.player.src,
    isPlaying: state.player.isPlaying,
    playlist: state.player.items,
    currentItem: state.player.currentItem
  }),
  dispatch => ({ dispatch })
)(Player)