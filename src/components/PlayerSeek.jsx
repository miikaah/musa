import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import { useAnimationFrame } from "../hooks";
import "./PlayerSeek.scss";

const PlayerSeek = ({
  player,
  duration,
  currentTime,
  setCurrentTime,
  isPlaying
}) => {
  const [prevCurrentTime, setPrevCurrentTime] = useState(0);

  const playerSeek = useRef(null);

  useAnimationFrame(() => {
    if (isPlaying) {
      setCurrentTime(get(player, "current.currentTime", 0));
    }
  });

  const seek = event => {
    if (prevCurrentTime === event.target.value) return;
    player.current.currentTime = event.target.value;
    setCurrentTime(event.target.value);
    setPrevCurrentTime(event.target.value);
    // Makes it possible to seek back to same spot after timeout
    // to prevent multiple seeks
    setTimeout(() => setPrevCurrentTime(-1), 500);
  };

  return (
    <span className="player-seek">
      <input
        type="range"
        min="0"
        max={duration}
        step="1"
        ref={playerSeek}
        value={currentTime}
        onChange={seek}
        onFocus={() => playerSeek.current.blur()}
      />
    </span>
  );
};

export default connect(
  state => ({
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlayerSeek);
