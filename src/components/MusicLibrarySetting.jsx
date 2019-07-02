import React, { useEffect } from "react"
import { connect } from "react-redux"
import { updateSettings } from "../reducers/settings.reducer"
import "./MusicLibrarySetting.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const MusicLibrarySetting = ({ musicLibraryPaths, dispatch }) => {
  useEffect(() => {
    ipcRenderer.on("addMusicLibraryPath", (event, path) => {
      dispatch(
        updateSettings({
          musicLibraryPaths: Array.from(new Set([...musicLibraryPaths, path]))
        })
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicLibraryPaths])

  const removeLibraryPath = path => {
    const paths = new Set(musicLibraryPaths)
    paths.delete(path)
    dispatch(updateSettings({ musicLibraryPaths: Array.from(paths) }))
  }

  return (
    <div className="music-library-setting">
      <h5>Paths</h5>
      {musicLibraryPaths.map((path, i) => (
        <div className="music-library-setting-path" key={i}>
          <input disabled readOnly value={path} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => removeLibraryPath(path)}
          >
            Del
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => ipcRenderer.send("addMusicLibraryPath")}
      >
        Add new
      </button>
    </div>
  )
}

export default connect(
  state => ({
    musicLibraryPaths: state.settings.musicLibraryPaths
  }),
  dispatch => ({ dispatch })
)(MusicLibrarySetting)
