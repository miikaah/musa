import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeFromPlaylist,
  removeRangeFromPlaylist
} from "../reducers/player.reducer";
import PlaylistItem from "./PlaylistItem";
import { isNaN } from "lodash-es";
import "./Playlist.scss";

const BACKSPACE = 8;

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
      case BACKSPACE: {
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
      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <ul className="playlist">
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
        <div ref={this.selectArea} className="playlist-select-area" />
      </div>
    );
  }

  updateEndIndex(endIndex) {
    if (!this.state.isMouseDown) return;
    this.setState({ endIndex });
  }

  onMouseDown(index) {
    this.setState({
      isMouseDown: true,
      activeIndex: index,
      startIndex: index,
      endIndex: index
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
}

export default connect(
  state => ({
    playlist: state.player.items
  }),
  dispatch => ({ dispatch })
)(Playlist);
