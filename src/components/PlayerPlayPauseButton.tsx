import React, { useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { PlayerState } from "../reducers/player.reducer";

const ButtonContainer = styled.span`
  margin-right: 8px;
  width: 20px;

  > button {
    font-size: 1.3rem;
    min-width: 16px;
  }
`;

type PlayerPlayPauseButtonProps = {
  playOrPause: () => void;
  isPlaying: PlayerState["isPlaying"];
};

const PlayerPlayPauseButton = ({
  playOrPause,
  isPlaying,
}: PlayerPlayPauseButtonProps) => {
  const playerPlayPauseRef = useRef<HTMLButtonElement | null>(null);

  return (
    <ButtonContainer>
      <button
        ref={playerPlayPauseRef}
        onClick={playOrPause}
        onFocus={() =>
          playerPlayPauseRef.current && playerPlayPauseRef.current.blur()
        }
      >
        <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} />
      </button>
    </ButtonContainer>
  );
};

export default connect(
  (state: { player: PlayerState }) => ({
    isPlaying: state.player.isPlaying,
  }),
  (dispatch) => ({ dispatch }),
)(PlayerPlayPauseButton);
