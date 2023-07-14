import React from "react";
import { connect } from "react-redux";
import styled, { StyleSheetManager } from "styled-components/macro";
import isPropValid from "@emotion/is-prop-valid";

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  font-size: var(--font-size-sm);
  z-index: 100;
  background-color: var(--color-slider-track);
`;

const ProgressBarValue = styled.div.attrs(({ width, scanColor }) => ({
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
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <ProgressBarContainer>
        <ProgressBarValue width={width} scanColor={scanColor} />
      </ProgressBarContainer>
    </StyleSheetManager>
  );
};

export default connect((state) => ({
  scanLength: state.library.scanLength,
  scannedLength: state.library.scannedLength,
  scanColor: state.library.scanColor,
}))(ProgressBar);
