import React, { useEffect } from "react"
import { connect } from "react-redux"
import { updateSettings } from "../reducers/settings.reducer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { doIdbRequest } from "../util"
import { get } from "lodash-es"
import "./MusicLibrarySetting.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const songListProps = {
  method: "get",
  storeName: "songList",
  key: "list"
}

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
    const libPaths = Array.from(paths)
    dispatch(updateSettings({ musicLibraryPaths: libPaths }))
    doIdbRequest({
      ...songListProps,
      onReqSuccess: req => () => {
        ipcRenderer.send(
          "removeMusicLibraryPath",
          get(req, "result.list"),
          libPaths,
          path
        )
      }
    })
  }

  const addLibraryPath = () => {
    doIdbRequest({
      ...songListProps,
      onReqSuccess: req => () => {
        ipcRenderer.send(
          "addMusicLibraryPath",
          get(req, "result.list"),
          musicLibraryPaths
        )
      }
    })
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
            <FontAwesomeIcon icon="trash" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary"
        onClick={addLibraryPath}
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
