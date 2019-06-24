import React, { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BasePage from "./BasePage"
import Library from "./Library"
import Settings from "./Settings"
import Search from "./Search"
import Player from "./Player"
import "./Toolbar.scss"

const Toolbar = () => {
  const [isLibraryVisible, setIsLibraryVisible] = useState(false)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(true)

  const libraryRef = useRef()
  const libraryButtonRef = useRef()
  const settingsRef = useRef()
  const settingsButtonRef = useRef()
  const searchRef = useRef()
  const searchButtonRef = useRef()

  useEffect(() => {
    const handleClick = e => {
      if (
        libraryButtonRef.current &&
        libraryButtonRef.current.contains(e.target)
      ) {
        setIsLibraryVisible(!isLibraryVisible)
        setIsSettingsVisible(false)
        setIsSearchVisible(false)
        return
      }
      if (
        settingsButtonRef.current &&
        settingsButtonRef.current.contains(e.target)
      ) {
        setIsSettingsVisible(!isSettingsVisible)
        setIsSearchVisible(false)
        return
      }
      if (
        searchButtonRef.current &&
        searchButtonRef.current.contains(e.target)
      ) {
        setIsSearchVisible(!isSearchVisible)
        setIsSettingsVisible(false)
        return
      }

      if (
        (libraryRef.current && libraryRef.current.contains(e.target)) ||
        (settingsRef.current && settingsRef.current.contains(e.target)) ||
        (searchRef.current && searchRef.current.contains(e.target))
      )
        return

      setIsLibraryVisible(false)
      setIsSettingsVisible(false)
      setIsSearchVisible(false)
    }

    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [isLibraryVisible, isSettingsVisible, isSearchVisible])

  return (
    <div className="toolbar">
      <button type="button" ref={libraryButtonRef}>
        <FontAwesomeIcon icon="bars" />
      </button>
      <Library ref={libraryRef} isVisible={isLibraryVisible} />

      <Player />

      <button type="button" ref={settingsButtonRef}>
        <FontAwesomeIcon icon="cog" />
      </button>
      <BasePage ref={settingsRef} isVisible={isSettingsVisible}>
        <Settings isVisible={isSettingsVisible} />
      </BasePage>

      <button type="button" ref={searchButtonRef}>
        <FontAwesomeIcon icon="search" />
      </button>
      <BasePage ref={searchRef} isVisible={isSearchVisible}>
        <Search />
      </BasePage>
    </div>
  )
}

export default Toolbar
