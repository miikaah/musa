import React, { Component } from "react"
import LibraryList from "./LibraryList"
import { isEqual, isEmpty, get, flatten } from "lodash-es"
import { connect } from "react-redux"
import { setListing, setScanProps } from "../reducers/library.reducer"
import { DB_NAME, DB_VERSION } from "../config"
import "./Library.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

const idbRequest = indexedDB.open(DB_NAME, DB_VERSION)

// Only refactor to use Hooks after figuring out
// how to work around multiple sequential state updates
// that this component needs.
class Library extends Component {
  componentDidMount() {
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
      try {
        event.target.result.createObjectStore("theme", { keyPath: "key" })
      } catch (e) {
        console.log(e)
      }
      try {
        event.target.result.createObjectStore("state", { keyPath: "key" })
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

      const objectStore = db
        .transaction("library", "readwrite")
        .objectStore("library")

      const objectStoreRequest = objectStore.getAll()

      objectStoreRequest.onsuccess = event => {
        const dbListing = objectStoreRequest.result
        this.props.dispatch(setListing(dbListing))

        ipcRenderer.on("libraryListing", (event, listing) => {
          const libraryOS = db
            .transaction("library", "readwrite")
            .objectStore("library")
          // this.props.dispatch(setListing(this.getNewListing(listing)))
          libraryOS.put(listing)
        })

        ipcRenderer.on("deleteLibraryListings", (event, keyPaths) => {
          const libraryOS = db
            .transaction("library", "readwrite")
            .objectStore("library")
          this.props.dispatch(
            setListing(
              this.getNewListing(
                this.props.listing.filter(
                  artist => !keyPaths.includes(artist.path)
                )
              )
            )
          )
          keyPaths.forEach(key => libraryOS.delete(key))
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
            this.props.dispatch(setListing(this.getNewListing(artist)))
          }
        })
      }

      ipcRenderer.on("startInitialScan", (event, scanLength) => {
        this.props.dispatch(setScanProps({ scanLength }))
      })
      ipcRenderer.on("updateInitialScan", (event, scannedLength) => {
        this.props.dispatch(setScanProps({ scannedLength }))
      })
      ipcRenderer.on("endInitialScan", () => {
        this.props.dispatch(setScanProps({ reset: true }))
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps)
  }

  getNewListing(listing) {
    if (isEmpty(listing)) return [...this.props.listing]
    return [
      ...this.props.listing.filter(artist => artist.path !== listing.path),
      listing
    ].sort((a, b) => a.path.localeCompare(b.path))
  }

  render() {
    return (
      <div ref={this.props.forwardRef} className="library">
        {this.props.listing &&
          this.props.listing.map((item, index) => (
            <LibraryList
              key={item.name + "-" + index}
              item={item}
              isRoot={true}
            />
          ))}
      </div>
    )
  }
}

const ConnectedLibrary = connect(
  state => ({
    listing: state.library.listing
  }),
  dispatch => ({ dispatch })
)(Library)

export default React.forwardRef((props, ref) => (
  <ConnectedLibrary {...props} forwardRef={ref} />
))
