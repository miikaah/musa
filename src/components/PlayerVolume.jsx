import React, { useRef } from "react";
import { connect } from "react-redux";
import "./PlayerVolume.scss";

const VOLUME_MUTED = 0;
const VOLUME_STEP = 5;

const PlayerVolume = ({ volume, setVolumeForStateAndPlayer, dispatch }) => {
  const playerVolume = useRef(null);

  const setVolumeByEvent = event => {
    const vol = parseInt(event.target.value, 10);
    const volume = vol === VOLUME_STEP ? VOLUME_MUTED : vol;
    setVolumeForStateAndPlayer(volume);
  };

  return (
    <span className="player-volume">
      <input
        type="range"
        min="0"
        max="100"
        ref={playerVolume}
        step={VOLUME_STEP}
        value={volume}
        onChange={setVolumeByEvent}
        onFocus={() => playerVolume.current.blur()}
      />
    </span>
  );
};

export default connect(
  state => ({
    volume: state.settings.volume
  }),
  dispatch => ({ dispatch })
)(PlayerVolume);
