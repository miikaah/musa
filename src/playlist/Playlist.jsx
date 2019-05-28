import React, { Component } from "react";
import { connect } from "react-redux";
import {
  pasteToPlaylist,
  removeRangeFromPlaylist,
  removeIndexesFromPlaylist,
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
    selectedIndexes: new Set(),
    clipboard: []
  };

  constructor() {
    super();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      // SELECT ALL
      case KEYS.A: {
        if (!this.isCtrlDown(event)) return;
        this.setState({
          startIndex: 0,
          endIndex: this.props.playlist.length - 1
        });
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

      case KEYS.Enter: {
        // CREATE NEW PLAYLIST FROM SELECTION
        if (
          this.isContinuousSelection() ||
          this.state.selectedIndexes.size > 1
        ) {
          let selItems;
          if (this.isContinuousSelection()) {
            const { selectedItems } = this.getContinuousSelData(true);
            selItems = selectedItems;
          }
          if (this.state.selectedIndexes.size > 1) {
            const { selectedItems } = this.getIndexesSelData(true);
            selItems = selectedItems;
          }

          this.props.dispatch(
            removeRangeFromPlaylist(0, this.props.playlist.length - 1)
          );
          this.props.dispatch(pasteToPlaylist(selItems, 0));
          this.setState({ startIndex: NaN, endIndex: NaN });
          return;
        }

        // PLAY OR REPLAY ACTIVE ITEM
        if (this.state.activeIndex < 0) return;
        if (this.shouldReplaySong()) {
          this.props.dispatch(replay(true));
          return;
        }
        this.props.dispatch(playIndex(this.state.activeIndex));
        return;
      }

      // REMOVE
      case KEYS.Backspace: {
        if (this.isContinuousSelection()) {
          this.handleContinuousSelection({
            type: "remove",
            getSelected: false
          });
          return;
        }
        if (this.isIndexesSelection()) {
          this.handleIndexesSelection({ type: "remove", getSelected: false });
          return;
        }
        return;
      }

      // CUT
      case KEYS.X: {
        if (!this.isCtrlDown(event)) return;
        if (this.isContinuousSelection()) {
          this.handleContinuousSelection({ type: "remove" });
          return;
        }
        if (this.isIndexesSelection()) {
          this.handleIndexesSelection({ type: "remove" });
          return;
        }
        return;
      }

      // COPY
      case KEYS.C: {
        if (!this.isCtrlDown(event)) return;
        if (this.isContinuousSelection()) {
          this.handleContinuousSelection({ type: "copy" });
          return;
        }
        if (this.isIndexesSelection()) {
          this.handleIndexesSelection({ type: "copy" });
          return;
        }
        return;
      }

      // DUPLICATE
      case KEYS.D: {
        if (!this.isCtrlDown(event) || !event.shiftKey) return;
        if (this.isContinuousSelection()) {
          this.handleContinuousSelection({ type: "duplicate" });
          return;
        }
        if (this.isIndexesSelection()) {
          this.handleIndexesSelection({ type: "duplicate" });
          return;
        }
        return;
      }

      // PASTE
      case KEYS.V: {
        if (!this.isCtrlDown(event)) return;
        this.props.dispatch(
          pasteToPlaylist(
            this.state.clipboard,
            event.shiftKey ? this.state.activeIndex - 1 : this.state.activeIndex
          )
        );
        return;
      }

      default:
        break;
    }
  };

  isContinuousSelection() {
    return (
      !isNaN(this.state.startIndex) &&
      !isNaN(this.state.endIndex) &&
      this.state.startIndex !== this.state.endIndex &&
      this.state.selectedIndexes.size < 2
    );
  }

  getContinuousSelData(getSelected) {
    const startIndex = Math.min(this.state.startIndex, this.state.endIndex);
    const endIndex = Math.max(this.state.startIndex, this.state.endIndex);
    const selectedItems = getSelected
      ? this.props.playlist.filter(
          (_, index) => index >= startIndex && index <= endIndex
        )
      : this.state.clipboard;
    return { startIndex, endIndex, selectedItems };
  }

  handleContinuousSelection({ type, getSelected = true }) {
    const { startIndex, endIndex, selectedItems } = this.getContinuousSelData(
      getSelected
    );

    switch (type) {
      case "remove": {
        this.props.dispatch(removeRangeFromPlaylist(startIndex, endIndex));
        this.setState({
          selectedIndexes: new Set(),
          startIndex: NaN,
          endIndex: NaN,
          clipboard: selectedItems,
          activeIndex: -1
        });
        return;
      }

      case "duplicate": {
        this.props.dispatch(
          pasteToPlaylist(selectedItems, this.state.activeIndex)
        );
        return;
      }

      default: {
        this.setState({ clipboard: selectedItems });
      }
    }
  }

  isIndexesSelection() {
    return this.state.activeIndex > -1 || this.state.selectedIndexes.size > 0;
  }

  getIndexesSelData(getSelected) {
    const indexes =
      this.state.selectedIndexes.size > 0
        ? Array.from(this.state.selectedIndexes.values())
        : [this.state.activeIndex];
    const selectedItems = getSelected
      ? indexes.map(i => this.props.playlist[i])
      : this.state.clipboard;
    return { indexes, selectedItems };
  }

  handleIndexesSelection({ type, getSelected = true }) {
    const { indexes, selectedItems } = this.getIndexesSelData(getSelected);

    switch (type) {
      case "remove": {
        this.props.dispatch(removeIndexesFromPlaylist(indexes));
        this.setState({
          selectedIndexes: new Set(),
          startIndex: NaN,
          endIndex: NaN,
          activeIndex:
            this.state.selectedIndexes.size > 1 ? -1 : this.state.activeIndex,
          clipboard: selectedItems
        });
        return;
      }

      case "duplicate": {
        this.props.dispatch(
          pasteToPlaylist(selectedItems, this.state.activeIndex)
        );
        return;
      }

      default: {
        this.setState({ clipboard: selectedItems });
      }
    }
  }

  isCtrlDown(event) {
    return event.ctrlKey || event.metaKey;
  }

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
            onSetActiveIndex={activeIndex => this.setState({ activeIndex })}
            isSelected={this.state.selectedIndexes.has(index)}
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
      activeIndex: options.index,
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
