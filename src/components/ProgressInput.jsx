import React from "react";
import styled, { css, StyleSheetManager } from "styled-components/macro";
import isPropValid from "@emotion/is-prop-valid";

const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: ${({ width }) => `${width}px`};
  height: 20px;
  cursor: pointer;

  &:hover {
    > div {
      background-color: #777;

      > div {
        > div {
          background-color: #f00;
        }
      }
    }
  }
`;

const sharedCss = css`
  border-radius: 2px;
  height: 4px;
  width: 100%;
`;

const Background = styled.div`
  ${sharedCss}
  max-width: ${({ width }) => `${width}px`};
  min-width: ${({ width }) => `${width}px`};
  background-color: var(--color-slider-track);
  display: flex;
  margin: 0 auto;
`;

const ForegroundWrapper = styled.div`
  ${sharedCss}
  overflow: hidden;
`;

const Foreground = styled.div.attrs(({ progress }) => ({
  style: {
    transform: `translateX(-${progress}%)`,
  },
}))`
  ${sharedCss}
  background-color: var(--color-slider);
`;

const ProgressInput = React.forwardRef(
  ({ progress, handleMouseDown, handleMouseMove, width }, ref) => {
    return (
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <Container
          ref={ref}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onFocus={() => ref.current.blur()}
          width={width + 20}
        >
          <Background width={width}>
            <ForegroundWrapper>
              <Foreground progress={progress} />
            </ForegroundWrapper>
          </Background>
        </Container>
      </StyleSheetManager>
    );
  },
);

export default ProgressInput;
