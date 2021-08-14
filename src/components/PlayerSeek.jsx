import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import ProgressInput from "./ProgressInput";
import { useInterval } from "../hooks";

const MAIN_BUTTON_DOWN = 1;

const PlayerSeek = ({
  player,
  duration,
  currentTime,
  setCurrentTime,
  isPlaying,
  currentItem,
}) => {
  const [prevCurrentTime, setPrevCurrentTime] = useState(0);

  const playerSeek = useRef(null);

  useInterval(() => {
    if (isPlaying) {
      setCurrentTime(get(player, "current.currentTime", 0));
    }
  }, 200);

  const seek = (seekPosInSeconds) => {
    if (prevCurrentTime === seekPosInSeconds) return;
    player.current.currentTime = seekPosInSeconds;
    setCurrentTime(seekPosInSeconds);
    setPrevCurrentTime(seekPosInSeconds);
    // Makes it possible to seek back to same spot after timeout
    // to prevent multiple seeks
    setTimeout(() => setPrevCurrentTime(-1), 500);
  };

  const hasCurrentItem = () => !!(currentItem && currentItem.metadata);

  const handleSeek = (e) => {
    if (!hasCurrentItem()) return;
    if (e.type === "mousemove" && e.buttons !== MAIN_BUTTON_DOWN) return;
    const x = e.clientX;
    const { left, width } = playerSeek.current.getBoundingClientRect();
    const pos = (x - left) / width;
    const seekPosInSeconds = Math.floor(duration * pos);
    seek(seekPosInSeconds);
  };

  const convertCurrentTimeToPercentage = () => {
    if (!hasCurrentItem()) return 100;
    return (1 - currentTime / duration) * 100;
  };

  return (
    <ProgressInput
      handleMouseDown={handleSeek}
      handleMouseMove={handleSeek}
      ref={playerSeek}
      progress={convertCurrentTimeToPercentage()}
      width={240}
    />
  );
};

export default connect(
  (state) => ({
    isPlaying: state.player.isPlaying,
    currentItem: state.player.currentItem,
  }),
  (dispatch) => ({ dispatch })
)(PlayerSeek);
