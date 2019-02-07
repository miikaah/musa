import React, { Component } from "react"
import LibraryList from "./LibraryList"
import "./Library.scss"

const electron = window.require("electron")
const ipcRenderer = electron.ipcRenderer

class Library extends Component {
  state = {
    listing: []
  }

  componentDidMount() {
    ipcRenderer.on("libraryListing", (event, listing) => {
      console.log(listing)
      this.setState({ listing })
    })
    ipcRenderer.send("getLibraryListing")
  }

  render() {
    return (
      <div className="library">
        {this.state.listing.map(item => <LibraryList key={item.name.toString() + "-" + Date.now()} item={item} />)}
      </div>
    )
  }
}

export default Library
