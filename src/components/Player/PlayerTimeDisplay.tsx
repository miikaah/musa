import React from "react";
import styled from "styled-components";
import { formatDuration } from "../../util";
import { PlayerState } from "../../reducers/player.reducer";

const TimeDisplay = styled.span`
  min-width: 86px;
  display: inline-block;
  text-align: right;
`;

const TimePlayed = styled.span`
  min-width: 36px;
  display: inline-block;
`;

type PlayerTimeDisplayProps = {
  currentTime: number;
  currentItem: PlayerState["currentItem"];
};

const PlayerTimeDisplay = ({
  currentTime,
  currentItem,
}: PlayerTimeDisplayProps) => {
  return (
    <TimeDisplay>
      <TimePlayed data-testid="TimeDisplayTimePlayed">
        {formatDuration(currentTime)}
      </TimePlayed>
      <span data-testid="TimeDisplaySeparator"> / </span>
      <span data-testid="TimeDisplayDuration">
        {formatDuration(currentItem?.metadata?.duration)}
      </span>
    </TimeDisplay>
  );
};

export default PlayerTimeDisplay;
