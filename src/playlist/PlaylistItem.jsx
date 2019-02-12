import React, { Component } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import { playItem } from "../reducers/player.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlaylistItem.scss";

class PlaylistItem extends Component {
  render() {
    return (
      <li
        className={
          this.props.index === this.props.activeIndex
            ? "playlist-item active"
            : "playlist-item"
        }
        onDoubleClick={() => {
          this.props.dispatch(playItem(this.props.item, this.props.index));
          this.props.onSetActiveIndex(this.props.index);
        }}
        onClick={() => this.props.onSetActiveIndex(this.props.index)}
      >
        <div className="cell cell-xxs">
          {this.props.index === this.props.currentIndex &&
          this.props.isPlaying ? (
            <FontAwesomeIcon icon="play" />
          ) : (
            ""
          )}
        </div>
        <div className="cell cell-sm left">
          {get(this.props.item, "metadata.artist", "")}
        </div>
        <div className="cell cell-sm left">
          {get(this.props.item, "metadata.album", "")}
        </div>
        <div className="cell cell-xs right">
          {get(this.props.item, "metadata.track", "")}
        </div>
        <div className="cell cell-md left">
          {get(this.props.item, "metadata.title", this.props.item.name)}
        </div>
        <div className="cell cell-xs left">
          {get(this.props.item, "metadata.duration", "")}
        </div>
        <div className="cell cell-xs right">
          {get(this.props.item, "metadata.date", "")}
        </div>
      </li>
    );
  }
}

export default connect(
  state => ({
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlaylistItem);
