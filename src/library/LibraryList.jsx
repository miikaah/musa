import React, { Component } from "react";
import LibraryItem from "./LibraryItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LibraryList.scss";

class LibraryList extends Component {
  state = {
    showFolderItems: false
  };

  render() {
    const item = this.props.item;
    const isAlbum = Array.isArray(item.albums);
    const hasSongs = Array.isArray(item.songs);
    const isUndefinedItemName = item.name === "undefined";
    if (isAlbum || hasSongs) {
      return isUndefinedItemName ? (
        item.songs.map(song => (
          <LibraryItem key={song.name + "-" + Date.now()} item={song} />
        ))
      ) : (
        <ul className="library-list">
          <li
            className="library-list-folder"
            key={item.name}
            onClick={this.toggleFolder.bind(this)}
          >
            {parseInt(item.date, 10) === 0 && (
              <FontAwesomeIcon className="caret-right" icon="caret-right" />
            )}
            {hasSongs && parseInt(item.date, 10) > 0
              ? `${item.date} - ${item.name}`
              : item.name}
          </li>
          {this.state.showFolderItems &&
            (item.albums || item.songs).map(child => (
              <LibraryList
                key={child.name + "-" + Date.now()}
                item={child}
                cover={item.cover}
              />
            ))}
        </ul>
      );
    }
    return (
      <LibraryItem
        key={item.name + "-" + Date.now()}
        item={item}
        cover={this.props.cover}
      />
    );
  }

  toggleFolder(event) {
    event.preventDefault();
    this.setState({
      showFolderItems: !this.state.showFolderItems
    });
  }
}

export default LibraryList;
