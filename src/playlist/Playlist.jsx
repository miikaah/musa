import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeFromPlaylist,
  removeRangeFromPlaylist,
  removeIndexesFromPaylist,
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
    endIndex: NaN,
    selectedIndexes: new Set()
  };

  constructor() {
    super();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      // REMOVE
      case KEYS.Backspace: {
        // Active item
        if (
          this.state.activeIndex > -1 &&
          isNaN(this.state.startIndex) &&
          isNaN(this.state.endIndex) &&
          this.state.selectedIndexes.size < 2
        ) {
          this.props.dispatch(removeFromPlaylist(this.state.activeIndex));
          return;
        }

        // Continuous selection
        if (
          !isNaN(this.state.startIndex) &&
          !isNaN(this.state.endIndex) &&
          this.state.selectedIndexes.size < 2
        ) {
          const startIndex = Math.min(
            this.state.startIndex,
            this.state.endIndex
          );
          const endIndex = Math.max(this.state.startIndex, this.state.endIndex);
          this.props.dispatch(removeRangeFromPlaylist(startIndex, endIndex));
          this.setState({ startIndex: NaN, endIndex: NaN });
          return;
        }

        // Selected indexes
        if (this.state.selectedIndexes.size > 1) {
          this.props.dispatch(
            removeIndexesFromPaylist(
              Array.from(this.state.selectedIndexes.values())
            )
          );
          this.setState({
            selectedIndexes: new Set(),
            startIndex: NaN,
            endIndex: NaN,
            activeIndex: -1
          });
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
          if (event.shiftKey) {
            this.setState({
              startIndex: !isNaN(this.state.startIndex)
                ? this.state.startIndex
                : activeIndex + 1,
              endIndex: activeIndex,
              activeIndex
            });
            return;
          }
          this.setState({
            startIndex: NaN,
            endIndex: NaN,
            activeIndex
          });
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
          if (event.shiftKey) {
            this.setState({
              startIndex: !isNaN(this.state.startIndex)
                ? this.state.startIndex
                : activeIndex - 1,
              endIndex: activeIndex,
              activeIndex
            });
            return;
          }
          this.setState({
            startIndex: NaN,
            endIndex: NaN,
            activeIndex
          });
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
          this.onMouseDown({
            index:
              event.target.className === PLAYLIST_CLASSNAME
                ? this.props.playlist.length - 1
                : 0,
            isShiftDown: event.shiftKey
          });
        }}
        onMouseUp={this.clearSelection.bind(this)}
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
            isSelected={this.state.selectedIndexes.has(index)}
            onSetActiveIndex={activeIndex =>
              this.setState({
                activeIndex
              })
            }
            onMouseOverItem={this.updateEndIndex.bind(this)}
            onMouseDownItem={this.onMouseDown.bind(this)}
            onMouseUpItem={this.onMouseUp.bind(this)}
          />
        ))}
      </ul>
    );
  }

  updateEndIndex(endIndex) {
    if (!this.state.isMouseDown) return;
    this.setState({ endIndex });
  }

  onMouseDown(options) {
    if (options.isShiftDown || options.isCtrlDown) return;
    this.setState({
      isMouseDown: true,
      startIndex: options.index,
      endIndex: options.index,
      selectedIndexes: new Set([options.index])
    });
  }

  onMouseUp(options) {
    if (options.isCtrlDown) {
      this.setState({
        isMouseDown: false,
        activeIndex: -1,
        selectedIndexes: new Set([...this.state.selectedIndexes, options.index])
      });
      return;
    }
    this.setState({
      isMouseDown: false,
      activeIndex: -1,
      startIndex: this.state.startIndex,
      endIndex: options.index
    });
  }

  clearSelection(event) {
    if (this.state.startIndex === this.state.endIndex && !event.shiftKey)
      this.setState({
        isMouseDown: false,
        activeIndex: -1,
        endIndex: NaN,
        selectedIndexes: new Set()
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
