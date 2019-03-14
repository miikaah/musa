import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeFromPlaylist,
  removeRangeFromPlaylist,
  playIndex,
  replay
} from "../reducers/player.reducer";
import PlaylistItem from "./PlaylistItem";
import { isNaN, isEqual } from "lodash-es";
import { KEYS } from "../util";
import "./Playlist.scss";

const PLAYLIST_CLASSNAME = "playlist";

class Playlist extends Component {
  state = {
    activeIndex: -1,
    isMouseDown: false,
    startIndex: NaN,
    endIndex: NaN
  };

  constructor() {
    super();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      // REMOVE
      case KEYS.Backspace: {
        if (this.state.activeIndex > -1)
          this.props.dispatch(removeFromPlaylist(this.state.activeIndex));
        if (!isNaN(this.state.startIndex) && !isNaN(this.state.endIndex)) {
          this.props.dispatch(
            removeRangeFromPlaylist(this.state.startIndex, this.state.endIndex)
          );
          this.setState({ startIndex: NaN, endIndex: NaN });
        }
        return;
      }
      // SELECT ALL
      case KEYS.A: {
        if (event.ctrlKey || event.metaKey) {
          this.setState({
            startIndex: 0,
            endIndex: this.props.playlist.length - 1
          });
        }
        return;
      }
      // MOVE UP
      case KEYS.Up: {
        event.preventDefault();
        const activeIndex = this.state.activeIndex - 1;
        if (activeIndex > -1) {
          this.setState({ activeIndex });
          return;
        }
        if (this.props.playlist.length)
          this.setState({ activeIndex: this.props.playlist.length - 1 });
        return;
      }
      // MOVE DOWN
      case KEYS.Down: {
        event.preventDefault();
        const activeIndex = this.state.activeIndex + 1;
        if (activeIndex < this.props.playlist.length) {
          this.setState({ activeIndex });
          return;
        }
        if (this.props.playlist.length) this.setState({ activeIndex: 0 });
        return;
      }
      // PLAY OR REPLAY ACTIVE ITEM
      case KEYS.Enter: {
        if (this.state.activeIndex < 0) return;
        if (this.shouldReplaySong()) {
          this.props.dispatch(replay(true));
          return;
        }
        this.props.dispatch(playIndex(this.state.activeIndex));
        return;
      }
      default:
        break;
    }
  };

  shouldReplaySong() {
    return (
      this.state.activeIndex === this.props.currentIndex &&
      isEqual(
        this.props.currentItem,
        this.props.playlist[this.state.activeIndex]
      )
    );
  }

  render() {
    return (
      <ul
        className={PLAYLIST_CLASSNAME}
        onMouseDown={event => {
          this.onMouseDown(
            event.target.className === PLAYLIST_CLASSNAME
              ? this.props.playlist.length - 1
              : 0
          );
        }}
        onMouseUp={() => this.clearSelection()}
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
            startIndex={this.state.startIndex}
            endIndex={this.state.endIndex}
            onSetActiveIndex={activeIndex =>
              this.setState({
                activeIndex,
                startIndex: NaN,
                endIndex: NaN
              })
            }
            onMouseOverItem={index => this.updateEndIndex(index)}
            onMouseDownItem={index => this.onMouseDown(index)}
            onMouseUpItem={index => this.onMouseUp(index)}
          />
        ))}
      </ul>
    );
  }

  updateEndIndex(endIndex) {
    if (!this.state.isMouseDown) return;
    this.setState({ endIndex });
  }

  onMouseDown(index) {
    this.setState({
      isMouseDown: true,
      startIndex: index,
      endIndex: NaN
    });
  }

  onMouseUp(index) {
    const startIndex = Math.min(this.state.startIndex, this.state.endIndex);
    const endIndex = Math.max(this.state.startIndex, this.state.endIndex);
    this.setState({
      isMouseDown: false,
      activeIndex: -1,
      startIndex,
      endIndex
    });
  }

  clearSelection() {
    if (this.state.startIndex === this.state.endIndex)
      this.setState({
        isMouseDown: false,
        activeIndex: -1,
        startIndex: NaN,
        endIndex: NaN
      });
    else
      this.setState({
        isMouseDown: false,
        activeIndex: -1
      });
  }
}

export default connect(
  state => ({
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex
  }),
  dispatch => ({ dispatch })
)(Playlist);
