import React from "react";
import styled, { css } from "styled-components/macro";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  cursor: pointer;

  :hover {
    > div {
      > div {
        > div {
          background-color: red;
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
  min-width: ${({ minWidth }) => minWidth};
  background-color: var(--color-slider-track);
  display: flex;
`;

const ForegroundWrapper = styled.div`
  ${sharedCss}
  overflow: hidden;
`;

const Foreground = styled.div.attrs(({ progress }) => ({
  style: {
    transform: `translateX(-${progress}%)`
  }
}))`
  ${sharedCss}
  background-color: var(--color-slider);
`;

const ProgressInput = React.forwardRef(
  ({ progress, handleMouseDown, handleMouseMove, minWidth }, ref) => {
    return (
      <Container
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onFocus={() => ref.current.blur()}
      >
        <Background minWidth={minWidth}>
          <ForegroundWrapper>
            <Foreground progress={progress} />
          </ForegroundWrapper>
        </Background>
      </Container>
    );
  }
);

export default ProgressInput;
