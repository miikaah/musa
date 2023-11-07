import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

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

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: 29px;
    max-width: 29px;

    > button {
      padding: 0 6px 0 0;
      margin: 0;
    }
  }
`;

export const VOLUME_STEP = 5;

type PlayerVolumeButtonProps = { volume: number; muteOrUnmute: () => void };

const PlayerVolumeButton = ({
  volume,
  muteOrUnmute,
}: PlayerVolumeButtonProps) => {
  const playerMute = useRef<HTMLButtonElement | null>(null);

  return (
    <VolumeButtonContainer>
      <button
        ref={playerMute}
        onClick={muteOrUnmute}
        onFocus={() => playerMute.current && playerMute.current.blur()}
      >
        <FontAwesomeIcon
          icon={volume > VOLUME_STEP - 1 ? "volume-up" : "volume-mute"}
          data-testid={"PlayerVolumeButtonIcon"}
        />
      </button>
    </VolumeButtonContainer>
  );
};

export default PlayerVolumeButton;
