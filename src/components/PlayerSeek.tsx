import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import ProgressInput from "./ProgressInput";
import { useInterval } from "../hooks";
import { breakpoints } from "../breakpoints";
import { PlayerState } from "../reducers/player.reducer";

const MAIN_BUTTON_DOWN = 1;

type PlayerSeekProps = {
  player: HTMLAudioElement;
  duration: number;
  currentTime: number;
  setCurrentTime: (seconds: number) => void;
  isPlaying: PlayerState["isPlaying"];
  currentItem: PlayerState["currentItem"];
};

const PlayerSeek = ({
  player,
  duration,
  currentTime,
  setCurrentTime,
  isPlaying,
  currentItem,
}: PlayerSeekProps) => {
  const [prevCurrentTime, setPrevCurrentTime] = useState(0);

  const playerSeekRef = useRef<HTMLDivElement | null>(null);

  useInterval(() => {
    if (isPlaying) {
      setCurrentTime(player.currentTime || 0);
    }
  }, 200);

  const seek = (seekPosInSeconds: number) => {
    if (prevCurrentTime === seekPosInSeconds) return;

    player.currentTime = seekPosInSeconds;
    setCurrentTime(seekPosInSeconds);
    setPrevCurrentTime(seekPosInSeconds);
    // Makes it possible to seek back to same spot after timeout
    // to prevent multiple seeks
    setTimeout(() => setPrevCurrentTime(-1), 500);
  };

  const hasCurrentItem = () => !!(currentItem && currentItem.metadata);

  const handleSeek = (e: React.MouseEvent) => {
    if (!hasCurrentItem()) {
      return;
    }
    if (e.type === "mousemove" && e.buttons !== MAIN_BUTTON_DOWN) {
      return;
    }
    if (!playerSeekRef.current) {
      return;
    }

    const x = e.clientX;
    const { left, width } = playerSeekRef.current.getBoundingClientRect();
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
      ref={playerSeekRef}
      progress={convertCurrentTimeToPercentage()}
      width={window.innerWidth < breakpoints.md ? 120 : 240}
    />
  );
};

export default connect(
  (state: { player: PlayerState }) => ({
    isPlaying: state.player.isPlaying,
    currentItem: state.player.currentItem,
  }),
  (dispatch) => ({ dispatch }),
)(PlayerSeek);
