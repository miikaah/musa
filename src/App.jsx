import React, { useState, useEffect, useRef } from "react"
import Library from "./components/Library"
import Settings from "./components/Settings"
import Playlist from "./components/Playlist"
import Toolbar from "./components/Toolbar"
import Cover from "./components/Cover"
import ProgressBar from "./components/ProgressBar"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCaretRight,
  faBars,
  faCog
} from "@fortawesome/free-solid-svg-icons"
import { connect } from "react-redux"
import { addToPlaylist } from "./reducers/player.reducer"
import { hideLibrary } from "./reducers/library.reducer"
import "./App.scss"

library.add(
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCaretRight,
  faBars,
  faCog
)

export const Colors = {
  Bg: "#21252b",
  Primary: "#753597",
  Secondary: "#21737e",
  Typography: "#fbfbfb",
  TypographyLight: "#000",
  DrGood: "#90ff00",
  DrMediocre: "#ffe02f",
  DrBad: "#f00",
  PrimaryRgb: [117, 53, 151],
  SliderTrack: "#424a56",
  SliderTrackRgb: [66, 74, 86],
  WhiteRgb: [255, 255, 255]
}

const initCssVars = () => {
  document.body.style.setProperty("--color-bg", Colors.Bg)
  document.body.style.setProperty("--color-primary-highlight", Colors.Primary)
  document.body.style.setProperty(
    "--color-secondary-highlight",
    Colors.Secondary
  )
  document.body.style.setProperty("--color-typography", Colors.Typography)
  document.body.style.setProperty(
    "--color-typography-primary",
    Colors.Typography
  )
  document.body.style.setProperty(
    "--color-typography-secondary",
    Colors.Typography
  )
  document.body.style.setProperty("--color-slider", Colors.Primary)
  document.body.style.setProperty("--color-dr-level", Colors.Typography)
}

const App = ({ isSettingsVisible, isLibraryVisible, dispatch }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const appCenterRef = useRef(null)
  const appRightRef = useRef(null)

  useEffect(() => {
    initCssVars()
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener("resize", handleResize)

    return () => {
      window.addEventListener("resize", handleResize)
    }
  }, [])

  const onDragOver = event => event.preventDefault()

  const onDrop = event => {
    const item = JSON.parse(event.dataTransfer.getData("text"))
    if (Array.isArray(item)) {
      item.forEach(song => dispatch(addToPlaylist(song)))
      return
    }
    dispatch(addToPlaylist(item))
  }

  const renderCenterAndRight = isLarge => {
    const appClasses = `${
      !isSettingsVisible ? "app-wrapper show-flex" : "app-wrapper hide"
    }`

    const libraryClasses = `${isLibraryVisible ? "show" : "hide"}`

    const scroll = ref => {
      ref.current &&
        ref.current.scrollTo({
          top: ref.current.scrollTop + 200,
          behavior: "smooth"
        })
    }

    const scrollPlaylist = () => {
      isLarge ? scroll(appRightRef) : scroll(appCenterRef)
    }

    const renderPlaylist = () => <Playlist onScrollPlaylist={scrollPlaylist} />

    return (
      <div className={appClasses}>
        <div className={libraryClasses}>
          <Library />
        </div>
        <div
          className="app-center"
          ref={appCenterRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => dispatch(hideLibrary())}
        >
          <Cover />
          {!isLarge && renderPlaylist()}
        </div>
        {isLarge && (
          <div
            className="app-right"
            ref={appRightRef}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => dispatch(hideLibrary())}
          >
            {renderPlaylist()}
          </div>
        )}
      </div>
    )
  }

  const settingsClasses = `${isSettingsVisible ? "show" : "hide"}`

  return (
    <div className="app">
      <ProgressBar />
      <Toolbar />
      <div className={settingsClasses}>
        <Settings />
      </div>
      <div>{renderCenterAndRight(windowWidth > 1279)}</div>
    </div>
  )
}

export default connect(
  state => ({
    isLibraryVisible: state.library.isVisible,
    isSettingsVisible: state.settings.isVisible
  }),
  dispatch => ({ dispatch })
)(App)
