import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayerVolumeButton.scss";

const VOLUME_STEP = 5;

const PlayerVolumeButton = ({ volume, muteOrUnmute }) => {
  const playerMute = useRef(null);

  return (
    <span className="player-volume-btn">
      <button
        ref={playerMute}
        onClick={muteOrUnmute}
        onFocus={() => playerMute.current.blur()}
      >
        <FontAwesomeIcon
          icon={volume > VOLUME_STEP - 1 ? "volume-up" : "volume-mute"}
        />
      </button>
    </span>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerVolumeButton);
