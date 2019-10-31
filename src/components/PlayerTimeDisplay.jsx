import React from "react";
import { connect } from "react-redux";
import { get } from "lodash-es";
import { prefixNumber } from "../util";
import "./PlayerTimeDisplay.scss";

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
    <span className="player-time-display">
      <span className="player-played">{formatCurrentTime(currentTime)}</span>
      <span> / </span>
      <span>{get(currentItem, "metadata.duration", "0:00")}</span>
    </span>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerTimeDisplay);
