import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { formatDuration } from "../../util";
import { AudioWithMetadata } from "@miikaah/musa-core";
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
      <TimePlayed>{formatDuration(currentTime)}</TimePlayed>
      <span> / </span>
      <span>{formatDuration(currentItem?.metadata?.duration)}</span>
    </TimeDisplay>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch }),
)(PlayerTimeDisplay);
