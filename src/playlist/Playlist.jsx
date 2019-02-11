import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromPlaylist } from "../reducers/player.reducer";
import PlaylistItem from "./PlaylistItem";
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
    console.log(event.keyCode, this.state.activeIndex);
    switch (event.keyCode) {
      case BACKSPACE:
        return this.props.dispatch(removeFromPlaylist(this.state.activeIndex));
      default:
        break;
    }
  };

  render() {
    return (
      <ul className="playlist" multiple>
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
    playlist: state.player.items
  }),
  dispatch => ({ dispatch })
)(Playlist);
