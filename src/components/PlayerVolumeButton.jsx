import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";

const VolumeButtonContainer = styled.span`
  margin-right: 16px;
  width: 20px;

  > button {
    font-size: 1rem;
  }
`;

const VOLUME_STEP = 5;

const PlayerVolumeButton = ({ volume, muteOrUnmute }) => {
  const playerMute = useRef(null);

  return (
    <VolumeButtonContainer>
      <button
        ref={playerMute}
        onClick={muteOrUnmute}
        onFocus={() => playerMute.current.blur()}
      >
        <FontAwesomeIcon
          icon={volume > VOLUME_STEP - 1 ? "volume-up" : "volume-mute"}
        />
      </button>
    </VolumeButtonContainer>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerVolumeButton);
