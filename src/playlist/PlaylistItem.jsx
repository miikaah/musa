import React, { Component } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import { playItem } from "../reducers/player.reducer";
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
        <div className="cell cell-xs" />
        <div className="cell cell-xs">
          {get(this.props.item, "metadata.track", "")}
        </div>
        <div className="cell cell-sm">
          {get(this.props.item, "metadata.title", this.props.item.name)}
        </div>
        <div className="cell cell-sm">
          {get(this.props.item, "metadata.artist", "")}
        </div>
        <div className="cell cell-sm">
          {get(this.props.item, "metadata.album", "")}
        </div>
        <div className="cell cell-xs">
          {get(this.props.item, "metadata.duration", "")}
        </div>
        <div className="cell cell-xs">
          {get(this.props.item, "metadata.date", "")}
        </div>
      </li>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(PlaylistItem);
