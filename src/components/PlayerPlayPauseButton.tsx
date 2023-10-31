import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const ButtonContainer = styled.span`
  margin-right: 8px;
  width: 20px;

  > button {
    font-size: 1.3rem;
    min-width: 16px;
  }
`;

const PlayerPlayPauseButton = ({ playOrPause, isPlaying }) => {
  const playerPlayPause = useRef(null);

  return (
    <ButtonContainer>
      <button
        ref={playerPlayPause}
        onClick={playOrPause}
        onFocus={() => playerPlayPause.current.blur()}
      >
        <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} />
      </button>
    </ButtonContainer>
  );
};

export default connect(
  (state) => ({
    isPlaying: state.player.isPlaying,
  }),
  (dispatch) => ({ dispatch }),
)(PlayerPlayPauseButton);
