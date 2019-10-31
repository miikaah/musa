import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayerPlayPauseButton.scss";

const PlayerPlayPauseButton = ({ playOrPause, isPlaying }) => {
  const playerPlayPause = useRef(null);

  return (
    <span className="player-play-pause">
      <button
        ref={playerPlayPause}
        onClick={playOrPause}
        onFocus={() => playerPlayPause.current.blur()}
      >
        <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} />
      </button>
    </span>
  );
};

export default connect(
  state => ({
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlayerPlayPauseButton);
