import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  font-size: var(--font-size-sm);
  z-index: 100;
  background-color: var(--color-slider-track);
`;

const ProgressBarValue = styled.div`
  background-color: red;
  width: ${({ width }) => width}%;
  height: 4px;
`;

const ProgressBar = ({ scanLength, scannedLength }) => {
  const width = scanLength > 0 ? (scannedLength / scanLength) * 100 : 0;

  if (width < 1) return null;

  return (
    <ProgressBarContainer>
      <ProgressBarValue width={width} />
    </ProgressBarContainer>
  );
};

export default connect((state) => ({
  scanLength: state.library.scanLength,
  scannedLength: state.library.scannedLength,
}))(ProgressBar);
