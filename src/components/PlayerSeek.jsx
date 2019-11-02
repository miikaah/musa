import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import styled from "styled-components/macro";
import { useAnimationFrame } from "../hooks";
import { rangeInput } from "../common.styles";

const SeekContainer = styled.span`
  margin-right: 16px;

  ${rangeInput}

  input {
    min-width: 240px;
  }
`;

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
    <SeekContainer>
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
    </SeekContainer>
  );
};

export default connect(
  state => ({
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlayerSeek);
