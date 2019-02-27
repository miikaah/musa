import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromPlaylist } from "../reducers/player.reducer";
import PlaylistItem from "./PlaylistItem";
import { get } from "lodash-es";
import "./Playlist.scss";

const BACKSPACE = 8;

class Playlist extends Component {
  state = {
    activeIndex: -1
  };

  constructor() {
    super();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      case BACKSPACE:
        return this.props.dispatch(removeFromPlaylist(this.state.activeIndex));
      default:
        break;
    }
  };

  render() {
    return (
      <ul
        className="playlist"
        style={{
          backgroundColor: `rgb(${get(
            this.props.backgroundSwatch,
            "rgb",
            "#21252b"
          )})`,
          borderColor: `rgb(${get(
            this.props.secondaryHighlightSwatch,
            "rgb",
            "#21737e"
          )})`
        }}
      >
        <li className="playlist-header">
          <div className="cell cell-xxs" />
          <div className="cell cell-sm left">Artist</div>
          <div className="cell cell-sm left">Album</div>
          <div className="cell cell-xs right">Tr</div>
          <div className="cell cell-md left">Title</div>
          <div className="cell cell-xs left">Length</div>
          <div className="cell cell-xs right">Date</div>
        </li>
        {this.props.playlist.map((item, index) => (
          <PlaylistItem
            key={item.name.toString() + "-" + index}
            item={item}
            index={index}
            activeIndex={this.state.activeIndex}
            onSetActiveIndex={activeIndex => this.setState({ activeIndex })}
          />
        ))}
      </ul>
    );
  }
}

export default connect(
  state => ({
    playlist: state.player.items,
    backgroundSwatch: state.palette.backgroundSwatch,
    secondaryHighlightSwatch: state.palette.secondaryHighlightSwatch
  }),
  dispatch => ({ dispatch })
)(Playlist);
