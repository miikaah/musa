import React, { Component } from "react";
import LibraryList from "./LibraryList";
import { isEqual } from "lodash-es";
import "./Library.scss";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Library extends Component {
  state = {
    listing: []
  };

  componentDidMount() {
    ipcRenderer.on("libraryListing", (event, listing) => {
      // console.log(listing)
      this.setState({
        listing: [...this.state.listing, listing]
      });
    });
    ipcRenderer.send("getLibraryListing");
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  render() {
    return (
      <div className="library">
        {this.state.listing.map((item, index) => (
          <LibraryList key={item.name.toString() + "-" + index} item={item} />
        ))}
      </div>
    );
  }
}

export default Library;
