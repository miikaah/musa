import React, { Component } from "react";
import LibraryList from "./LibraryList";
import { isEqual, isEmpty, get, defaultTo, flatten } from "lodash-es";
import "./Library.scss";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const dbName = "musa_db";

const idbRequest = indexedDB.open(dbName, 1);

class Library extends Component {
  state = {
    listing: []
  };

  componentDidMount() {
    ipcRenderer.on("error", (event, error) => console.error(error));
    idbRequest.onerror = event => console.error(event);
    idbRequest.onupgradeneeded = event => {
      event.target.result.createObjectStore("songList", { keyPath: "key" });
      event.target.result.createObjectStore("library", { keyPath: "path" });
    };
    idbRequest.onsuccess = event => {
      const db = event.target.result;
      const songListStore = db
        .transaction("songList", "readwrite")
        .objectStore("songList");

      const songListStoreRequest = songListStore.get("list");

      songListStoreRequest.onsuccess = event => {
        ipcRenderer.on("updateSongList", (event, songList) => {
          const songListOS = db
            .transaction("songList", "readwrite")
            .objectStore("songList");
          songListOS.put({ key: "list", list: songList });
        });
        const dbSongList = songListStoreRequest.result;
        ipcRenderer.send("initLibrary", get(dbSongList, "list", []));
      };

      /////
      const objectStore = db
        .transaction("library", "readwrite")
        .objectStore("library");

      const objectStoreRequest = objectStore.getAll();

      objectStoreRequest.onsuccess = event => {
        const dbListing = objectStoreRequest.result;
        this.setState({ listing: dbListing });

        ipcRenderer.on("libraryListing", (event, listing) => {
          const libraryOS = db
            .transaction("library", "readwrite")
            .objectStore("library");
          this.setState({ listing: this.getNewListing(listing) });
          libraryOS.put(listing);
        });

        ipcRenderer.on("updateSongMetadata", (event, song) => {
          const artistOS = db
            .transaction("library", "readwrite")
            .objectStore("library");
          const artistReq = artistOS.get(song.artistPath);
          artistReq.onsuccess = event => {
            const artist = artistReq.result;
            const oldSong = flatten(
              defaultTo(artist.albums, []).map(a => a.songs)
            ).find(s => s.path === song.path);
            oldSong.metadata = song.metadata;
            artistOS.put(artist);
            this.setState({ listing: this.getNewListing(artist) });
          };
        });
      };
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  getNewListing(listing) {
    if (isEmpty(listing)) return [...this.state.listing];
    return [
      ...this.state.listing.filter(artist => artist.path !== listing.path),
      listing
    ].sort((a, b) => a.path.localeCompare(b.path));
  }

  render() {
    return (
      <div className="library">
        {this.state.listing.map((item, index) => (
          <LibraryList key={item.name + "-" + index} item={item} />
        ))}
      </div>
    );
  }
}

export default Library;
