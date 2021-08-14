import React, { useRef } from "react";
import { connect } from "react-redux";
import ProgressInput from "./ProgressInput";

const MAIN_BUTTON_DOWN = 1;

const VOLUME_MUTED = 0;
const VOLUME_STEP = 5;

const PlayerVolume = ({ volume, setVolumeForStateAndPlayer, dispatch }) => {
  const playerVolume = useRef(null);

  const setVolumeByEvent = (vol) => {
    setVolumeForStateAndPlayer(vol <= VOLUME_STEP ? VOLUME_MUTED : vol);
  };

  const handleVolumeChange = (e) => {
    if (e.type === "mousemove" && e.buttons !== MAIN_BUTTON_DOWN) return;
    const x = e.clientX;
    const { left, width } = playerVolume.current.getBoundingClientRect();
    const vol = Math.floor(((x - left) / width) * 100);
    setVolumeByEvent(vol);
  };

  const convertVolumeToPercentage = () => {
    return 100 - volume;
  };

  return (
    <ProgressInput
      handleMouseDown={handleVolumeChange}
      handleMouseMove={handleVolumeChange}
      ref={playerVolume}
      progress={convertVolumeToPercentage()}
      width={120}
    />
  );
};

export default connect(
  (state) => ({
    volume: state.settings.volume,
  }),
  (dispatch) => ({ dispatch })
)(PlayerVolume);
