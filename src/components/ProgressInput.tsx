import React from "react";
import styled, { css } from "styled-components";

const Container = styled.div<{ width: number }>`
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

const Background = styled.div<{ width: number }>`
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

const Foreground = styled.div.attrs<{ progress: number }>(({ progress }) => ({
  style: {
    transform: `translateX(-${progress}%)`,
  },
}))`
  ${sharedCss}
  background-color: var(--color-slider);
`;

type ProgressInputProps = {
  progress: number;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  width: number;
  ["data-testid"]?: string;
};

const ProgressInput = React.forwardRef(
  (props: ProgressInputProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { progress, handleMouseDown, handleMouseMove, width } = props;

    return (
      <Container
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onFocus={() =>
          typeof ref !== "function" && ref?.current && ref?.current.blur()
        }
        width={width + 20}
        data-testid={props["data-testid"]}
      >
        <Background width={width}>
          <ForegroundWrapper>
            <Foreground progress={progress} />
          </ForegroundWrapper>
        </Background>
      </Container>
    );
  },
);

export default ProgressInput;
