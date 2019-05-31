import React, { useState } from "react"
import LibraryList from "./LibraryList"
import { isEqual, isEmpty, get, flatten } from "lodash-es"
import { connect } from "react-redux"
import { setScanProps } from "../reducers/library.reducer"
import "./Library.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const dbName = "musa_db"
const dbVersion = 3

const idbRequest = indexedDB.open(dbName, dbVersion)

let isInit = false

// https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate
const Library = React.memo(
  ({ isVisible, dispatch }) => {
    const [listing, setListing] = useState([])

    if (!isInit) {
      let dbListing = []

      const setNewListing = newRecord => {
        if (isEmpty(newRecord)) return
        setListing(
          [
            ...dbListing.filter(record => record.path !== newRecord.path),
            newRecord
          ].sort((a, b) => a.path.localeCompare(b.path))
        )
      }

      ipcRenderer.on("log", (event, log) => console.log("(main)", log))
      ipcRenderer.on("error", (event, error) => console.error(error))
      idbRequest.onerror = event => console.error(event)
      idbRequest.onupgradeneeded = event => {
        try {
          event.target.result.createObjectStore("songList", { keyPath: "key" })
        } catch (e) {
          console.log(e)
        }
        try {
          event.target.result.createObjectStore("library", { keyPath: "path" })
        } catch (e) {
          console.log(e)
        }
      }
      idbRequest.onsuccess = event => {
        const db = event.target.result
        const songListStore = db
          .transaction("songList", "readwrite")
          .objectStore("songList")

        const songListStoreRequest = songListStore.get("list")

        songListStoreRequest.onsuccess = event => {
          ipcRenderer.on("updateSongList", (event, songList) => {
            const songListOS = db
              .transaction("songList", "readwrite")
              .objectStore("songList")
            songListOS.put({ key: "list", list: songList })
          })
          const dbSongList = songListStoreRequest.result
          ipcRenderer.send("initLibrary", get(dbSongList, "list", []))
        }

        /////
        const objectStore = db
          .transaction("library", "readwrite")
          .objectStore("library")

        const objectStoreRequest = objectStore.getAll()

        objectStoreRequest.onsuccess = event => {
          dbListing = objectStoreRequest.result
          setListing(dbListing)

          ipcRenderer.on("libraryListing", (event, listing) => {
            const libraryOS = db
              .transaction("library", "readwrite")
              .objectStore("library")
            setNewListing(listing)
            libraryOS.put(listing)
          })

          ipcRenderer.on("deleteLibraryListings", (event, keyPath) => {
            const libraryOS = db
              .transaction("library", "readwrite")
              .objectStore("library")
            dbListing = dbListing.filter(
              artist => !keyPath.includes(artist.path)
            )
            setListing(dbListing)
            libraryOS.delete(keyPath)
          })

          ipcRenderer.on("updateSongMetadata", (event, song) => {
            const artistOS = db
              .transaction("library", "readwrite")
              .objectStore("library")
            const artistReq = artistOS.get(song.artistPath)
            artistReq.onsuccess = event => {
              const artist = artistReq.result
              const oldSong = flatten(
                get(artist, "albums", []).map(a => a.songs)
              ).find(s => s.path === song.path)
              oldSong.metadata = song.metadata
              artistOS.put(artist)
              setNewListing(artist)
            }
          })
        }

        ipcRenderer.on("startInitialScan", (event, scanLength) => {
          dispatch(setScanProps({ scanLength }))
        })
        ipcRenderer.on("updateInitialScan", (event, scannedLength) => {
          dispatch(setScanProps({ scannedLength }))
        })
        ipcRenderer.on("endInitialScan", () => {
          dispatch(setScanProps({ reset: true }))
        })
        isInit = true
      }
    }

    return (
      <div className={`library ${isVisible ? "show" : "hide"}`}>
        {listing.map((item, index) => (
          <LibraryList
            key={item.name + "-" + index}
            item={item}
            isRoot={true}
          />
        ))}
      </div>
    )
  },
  (props, nextProps) => !isEqual(props, nextProps)
)

export default connect(
  state => ({
    isVisible: state.library.isVisible
  }),
  dispatch => ({ dispatch })
)(Library)
