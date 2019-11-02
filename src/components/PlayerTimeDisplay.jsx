import React from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import styled from "styled-components/macro";
import { prefixNumber } from "../util";

const TimeDisplay = styled.span`
  padding-left: 12px;
`;

const TimePlayed = styled.span`
  min-width: 36px;
  display: inline-block;
  text-align: left;
`;

const PlayerTimeDisplay = ({ currentTime, currentItem }) => {
  const formatCurrentTime = duration => {
    if (duration < 1) return "0:00";
    let output = "";
    if (duration >= 3600) {
      output += prefixNumber(Math.floor(duration / 3600)) + ":";
      output +=
        prefixNumber(Math.floor((Math.floor(duration) % 3600) / 60)) + ":";
    } else output += Math.floor((Math.floor(duration) % 3600) / 60) + ":";
    output += prefixNumber(Math.floor(duration % 60));
    return output;
  };

  return (
    <TimeDisplay>
      <TimePlayed>{formatCurrentTime(currentTime)}</TimePlayed>
      <span> / </span>
      <span>{get(currentItem, "metadata.duration", "0:00")}</span>
    </TimeDisplay>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerTimeDisplay);
