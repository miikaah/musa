import React from "react";
import { connect } from "react-redux";
import "./ProgressBar.scss";

const ProgressBar = ({ scanLength, scannedLength }) => {
  const width = scanLength > 0 ? (scannedLength / scanLength) * 100 : 0;
  return (
    <div className="progress-bar">
      <div className="progress-bar-value" style={{ width: `${width}%` }} />
    </div>
  );
};

export default connect(state => ({
  scanLength: state.library.scanLength,
  scannedLength: state.library.scannedLength
}))(ProgressBar);
