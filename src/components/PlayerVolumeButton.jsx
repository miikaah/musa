import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";

const VolumeButtonContainer = styled.span`
  min-width: 42px;
  max-width: 42px;
  display: inline-block;
  margin-top: 2px;

  > button {
    padding: 0 6px;
    margin: 0 0 0 10px;
    font-size: 1rem;
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    min-width: 29px;
    max-width: 29px;

    > button {
      padding: 0 6px 0 0;
      margin: 0;
    }
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
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(PlayerVolumeButton);
