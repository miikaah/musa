import React, { Component } from "react";
import { connect } from "react-redux";
import { get, isNaN, isEqual } from "lodash-es";
import { playIndex, replay } from "../reducers/player.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlaylistItem.scss";

class PlaylistItem extends Component {
  render() {
    const classes = this.getClassNames(
      this.props.index,
      this.props.activeIndex,
      this.props.startIndex,
      this.props.endIndex,
      this.props.isSelected
    );
    return (
      <li
        className={classes}
        onDoubleClick={() => {
          if (this.shouldReplaySong()) {
            this.props.dispatch(replay(true));
            return;
          }
          this.props.dispatch(playIndex(this.props.index));
          this.props.onSetActiveIndex(this.props.index);
        }}
        onClick={event => {
          if (!event.shiftKey) this.props.onSetActiveIndex(this.props.index);
        }}
        onMouseOver={() => this.props.onMouseOverItem(this.props.index)}
        onMouseDown={event => {
          this.props.onMouseDownItem({
            index: this.props.index,
            isShiftDown: event.shiftKey,
            isCtrlDown: event.ctrlKey || event.metaKey
          });
          event.stopPropagation();
        }}
        onMouseUp={event => {
          this.props.onMouseUpItem({
            index: this.props.index,
            isShiftDown: event.shiftKey,
            isCtrlDown: event.ctrlKey || event.metaKey
          });
          event.stopPropagation();
        }}
      >
        <div className="cell cell-xxs">{this.renderPlayOrPauseIcon()}</div>
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

  getClassNames(index, activeIndex, startIndex, endIndex, isSelected) {
    let className = "playlist-item";
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    if (index === activeIndex) className += " active";
    if (
      (!isNaN(startIndex) &&
        !isNaN(endIndex) &&
        index >= start &&
        index <= end) ||
      isSelected
    )
      className += " selected";
    return className;
  }

  shouldReplaySong() {
    return this.isIndexCurrentIndex() && this.hasEqualItemAndCurrentItem();
  }

  isIndexCurrentIndex() {
    return this.props.index === this.props.currentIndex;
  }

  hasEqualItemAndCurrentItem() {
    return isEqual(this.props.item, this.props.currentItem);
  }

  renderPlayOrPauseIcon() {
    if (!this.isIndexCurrentIndex() || !this.hasEqualItemAndCurrentItem())
      return;
    return this.props.isPlaying ? (
      <FontAwesomeIcon icon="play" />
    ) : (
      <FontAwesomeIcon icon="pause" />
    );
  }
}

export default connect(
  state => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlaylistItem);
