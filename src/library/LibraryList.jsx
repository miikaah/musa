import React, { Component } from "react";
import { connect } from "react-redux";
import LibraryItem from "./LibraryItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { flatten, defaultTo } from "lodash-es";
import "./LibraryList.scss";

class LibraryList extends Component {
  state = {
    showFolderItems: false
  };

  render() {
    const item = this.props.item;
    const isArtist = Array.isArray(item.albums);
    const isAlbum = Array.isArray(item.songs);
    const isRoot = this.props.isRoot;
    const isUndefinedItemName = item.name === "undefined";
    if (isArtist || isAlbum) {
      return isUndefinedItemName ? (
        item.songs.filter(Boolean).map((song, i) => {
          return <LibraryItem key={`${song.name}-${i}`} item={song} />;
        })
      ) : (
        <ul
          className={`library-list ${isRoot ? "root" : ""}`}
          draggable
          onDragStart={event =>
            this.onDragStart(event, item, isArtist, isAlbum)
          }
        >
          <li
            className="library-list-folder"
            key={item.name}
            onClick={this.toggleFolder.bind(this)}
          >
            {parseInt(item.date, 10) === 0 && (
              <FontAwesomeIcon className="caret-right" icon="caret-right" />
            )}
            {isAlbum && parseInt(item.date, 10) > 0
              ? `${item.date} - ${item.name}`
              : item.name}
          </li>
          {this.state.showFolderItems &&
            (item.albums || item.songs).map((child, i) => (
              <LibraryList
                key={`${child.name}-${i}`}
                item={child}
                cover={item.cover}
                dispatch={this.props.dispatch}
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

  getArtistOrAlbumSongs(item, isArtist, isAlbum) {
    if (isArtist)
      return flatten(
        item.albums.map(a =>
          defaultTo(a.songs, []).map(s => ({ ...s, cover: a.cover }))
        )
      );
    if (isAlbum)
      return item.songs.map(song => ({ ...song, cover: item.cover }));
  }

  onDragStart(event, item, isArtist, isAlbum) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify(this.getArtistOrAlbumSongs(item, isArtist, isAlbum))
    );
    event.stopPropagation();
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryList);
