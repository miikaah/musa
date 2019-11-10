import React, { Component } from "react";
import LibraryList from "./LibraryList";
import { isEqual, isEmpty, get } from "lodash-es";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import {
  initListing,
  setListing,
  setScanProps
} from "reducers/library.reducer";
import { DB_NAME, DB_VERSION } from "../config";
import { listOverflow } from "../common.styles";

const LibraryContainer = styled.div`
  text-align: left;
  border: 0 solid var(--color-secondary-highlight);
  border-left-width: 4px;
  border-right-width: 1px;
  background-color: var(--color-bg);
  box-shadow: 25px 10px 31px -17px rgba(10, 10, 10, 0.75);
  position: absolute;
  min-width: 400px;
  z-index: 1;
  height: 100vh;
  margin: 30px 0 0 -12px;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};

  ${listOverflow}
`;

const LibraryLabel = styled.div`
  text-align: right;
  padding: 20px;

  span {
    color: var(--color-typography-primary);
    background-color: var(--color-primary-highlight);
    padding: 5px 10px;
    font-size: 40px;
    border-radius: 3px;
  }
`;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const idbRequest = indexedDB.open(DB_NAME, DB_VERSION);

// Only refactor to use Hooks after figuring out
// how to work around multiple sequential state updates
// that this component needs.
class Library extends Component {
  componentDidMount() {
    ipcRenderer.on("log", (event, log) => console.log("(main)", log));
    ipcRenderer.on("error", (event, error) => console.error(error));

    idbRequest.onerror = event => console.error(event);
    idbRequest.onupgradeneeded = event => {
      try {
        event.target.result.createObjectStore("songList", { keyPath: "key" });
      } catch (e) {
        console.log(e);
      }
      try {
        event.target.result.createObjectStore("library", { keyPath: "path" });
      } catch (e) {
        console.log(e);
      }
      try {
        event.target.result.createObjectStore("theme", { keyPath: "key" });
      } catch (e) {
        console.log(e);
      }
      try {
        event.target.result.createObjectStore("state", { keyPath: "key" });
      } catch (e) {
        console.log(e);
      }
    };

    idbRequest.onsuccess = event => {
      const db = event.target.result;
      const stateReq = db
        .transaction("state", "readwrite")
        .objectStore("state")
        .get("state");

      stateReq.onsuccess = () => {
        const songListReq = db
          .transaction("songList", "readwrite")
          .objectStore("songList")
          .get("list");

        songListReq.onsuccess = () => {
          ipcRenderer.on("updateSongList", (_, songList) => {
            db.transaction("songList", "readwrite")
              .objectStore("songList")
              .put({ key: "list", list: songList });
          });
          const dbSongList = songListReq.result;
          const dbState = stateReq.result;
          ipcRenderer.send(
            "initLibrary",
            get(dbSongList, "list", []),
            get(dbState, "musicLibraryPaths", [])
          );
        };
      };

      const libraryReq = db
        .transaction("library", "readwrite")
        .objectStore("library")
        .getAll();

      libraryReq.onsuccess = event => {
        const dbListing = libraryReq.result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.props.dispatch(initListing(dbListing));

        ipcRenderer.on("libraryListing", (event, listing) => {
          if (isEmpty(listing)) return;
          db.transaction("library", "readwrite")
            .objectStore("library")
            .put(listing);
          this.props.dispatch(setListing(this.getNewListing(listing)));
        });

        ipcRenderer.on("deleteLibraryListings", (event, keyPaths) => {
          const libraryOS = db
            .transaction("library", "readwrite")
            .objectStore("library");

          if (Array.isArray(keyPaths)) {
            this.props.dispatch(
              setListing(
                this.props.listing.filter(
                  artist => !keyPaths.includes(artist.path)
                )
              )
            );
            keyPaths.forEach(key => libraryOS.delete(key));
            return;
          }
          this.props.dispatch(
            setListing(
              this.props.listing.filter(artist => artist.path !== keyPaths)
            )
          );
          libraryOS.delete(keyPaths);
        });
      };

      ipcRenderer.on("startInitialScan", (event, scanLength) => {
        this.props.dispatch(setScanProps({ scanLength }));
      });
      ipcRenderer.on("updateInitialScan", (event, scannedLength) => {
        this.props.dispatch(setScanProps({ scannedLength }));
      });
      ipcRenderer.on("endInitialScan", () => {
        this.props.dispatch(setScanProps({ reset: true }));
      });
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }

  getNewListing(listing) {
    if (isEmpty(listing)) return [...this.props.listing];
    return [
      ...this.props.listing.filter(artist => artist.path !== listing.path),
      listing
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  render() {
    const { forwardRef, isVisible, listingWithLabels } = this.props;
    return (
      <LibraryContainer ref={forwardRef} isVisible={isVisible}>
        {listingWithLabels &&
          Object.keys(listingWithLabels).map(key => {
            if (isEmpty(listingWithLabels[key])) return null;
            return (
              <div key={key}>
                <LibraryLabel>
                  <span>{key}</span>
                </LibraryLabel>
                {listingWithLabels[key].map((item, index) => (
                  <LibraryList
                    key={item.name + "-" + index}
                    item={item}
                    isRoot={true}
                  />
                ))}
              </div>
            );
          })}
      </LibraryContainer>
    );
  }
}

const ConnectedLibrary = connect(
  state => ({
    listing: state.library.listing,
    listingWithLabels: state.library.listingWithLabels
  }),
  dispatch => ({ dispatch })
)(Library);

export default React.forwardRef((props, ref) => (
  <ConnectedLibrary {...props} forwardRef={ref} />
));
