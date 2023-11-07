import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { LibraryState } from "../../reducers/library.reducer";

const ProgressBarContainer = styled("div")`
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  font-size: var(--font-size-sm);
  z-index: 100;
  background-color: var(--color-slider-track);
`;

const ProgressBarValue = styled.div.attrs<{ width: number; scanColor: string }>(
  ({ width }) => ({
    style: {
      width: `${width}%`,
    },
  }),
)`
  background-color: ${({ scanColor }) => scanColor};
  height: 4px;
`;

type ProgressBarProps = {
  scanLength: number;
  scannedLength: number;
  scanColor: string;
};

const ProgressBar = ({
  scanLength,
  scannedLength,
  scanColor,
}: ProgressBarProps) => {
  const width = scanLength > 0 ? (scannedLength / scanLength) * 100 : 0;

  if (width < 1) {
    return null;
  }

  return (
    <ProgressBarContainer>
      <ProgressBarValue
        width={width}
        scanColor={scanColor}
        data-testid="ProgressBarValue"
      />
    </ProgressBarContainer>
  );
};

export default connect((state: { library: LibraryState }) => ({
  scanLength: state.library.scanLength,
  scannedLength: state.library.scannedLength,
  scanColor: state.library.scanColor,
}))(ProgressBar);
