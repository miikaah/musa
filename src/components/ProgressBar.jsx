import React from "react";
import { connect } from "react-redux";
import styled, { styledWithPropFilter } from "styled";

const ProgressBarContainer = styled("div")`
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  font-size: var(--font-size-sm);
  z-index: 100;
  background-color: var(--color-slider-track);
`;

const ProgressBarValue = styledWithPropFilter("div").attrs(({ width }) => ({
  style: {
    width: `${width}%`,
  },
}))`
  background-color: ${({ scanColor }) => scanColor};
  height: 4px;
`;

const ProgressBar = ({ scanLength, scannedLength, scanColor }) => {
  const width = scanLength > 0 ? (scannedLength / scanLength) * 100 : 0;

  if (width < 1) return null;

  return (
    <ProgressBarContainer>
      <ProgressBarValue width={width} scanColor={scanColor} />
    </ProgressBarContainer>
  );
};

export default connect((state) => ({
  scanLength: state.library.scanLength,
  scannedLength: state.library.scannedLength,
  scanColor: state.library.scanColor,
}))(ProgressBar);
