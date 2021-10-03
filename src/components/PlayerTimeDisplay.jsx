import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { formatDuration } from "../util";

const TimeDisplay = styled.span`
  min-width: 86px;
  display: inline-block;
  text-align: right;
`;

const TimePlayed = styled.span`
  min-width: 36px;
  display: inline-block;
`;

const PlayerTimeDisplay = ({ currentTime, currentItem }) => {
  return (
    <TimeDisplay>
      <TimePlayed>{formatDuration(currentTime)}</TimePlayed>
      <span> / </span>
      <span>{formatDuration(currentItem?.metadata?.duration || "0:00")}</span>
    </TimeDisplay>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(PlayerTimeDisplay);
