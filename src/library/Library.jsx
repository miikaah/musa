import React, { Component } from "react";
import LibraryList from "./LibraryList";
import { isEqual, isEmpty } from "lodash-es";
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
      event.target.result.createObjectStore("library", { keyPath: "path" });
    };
    idbRequest.onsuccess = event => {
      const db = event.target.result;
      const objectStore = db
        .transaction("library", "readwrite")
        .objectStore("library");

      const objectStoreRequest = objectStore.getAll();

      objectStoreRequest.onsuccess = event => {
        const dbListing = objectStoreRequest.result;
        this.setState({ listing: dbListing });

        ipcRenderer.on("libraryListing", (event, listing) => {
          console.log(listing);
          this.setState({ listing: this.getNewListing(listing) });
        });
        ipcRenderer.on("libraryListingEnd", () => {
          const libraryObjStore = db
            .transaction("library", "readwrite")
            .objectStore("library");
          this.state.listing.forEach(listing => libraryObjStore.put(listing));
        });
        if (isEmpty(dbListing)) ipcRenderer.send("getLibraryListing");
        // ipcRenderer.send("getLibraryListing");
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
