import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components/macro";

/*
 * Square is a good shape for seeing the relative power differences
 * of different parts of the spectrum.
 */
const width = 500;
const spectroWidth = 500;
const peakWidth = 45;
const height = width;
const spectroHeight = height - 100;
const peakHeight = 300;

let spectroCanvas;
let tempCanvas;
let barCtx;
let peakCtx;
let spectroCtx;
let tempCtx;

const Container = styled.div`
  overflow: hidden;
  max-height: 900px;
`;

const TopWrapper = styled.div`
  position: relative;

  > canvas:nth-of-type(2) {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

let lastDrawAt = Date.now();

const Visualizer = ({
  dispatch,
  forwardRef,
  isVisible,
  update,
  dataArray,
  dataArrayL,
  dataArrayR,
  peakMeterBuffer,
  peakMeterBufferL,
  peakMeterBufferR,
}) => {
  const location = useLocation();
  const shouldDraw =
    isVisible && location.pathname === "/" && Date.now() - lastDrawAt > 16;

  useEffect(() => {
    const barCanvas = document.getElementById("barCanvas");
    barCtx = barCanvas.getContext("2d");
    const peakCanvas = document.getElementById("peakCanvas");
    peakCtx = peakCanvas.getContext("2d");
    spectroCanvas = document.getElementById("spectroCanvas");
    spectroCtx = spectroCanvas.getContext("2d");
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = spectroWidth;
    tempCanvas.height = spectroHeight;
    tempCtx = tempCanvas.getContext("2d");
  }, []);

  // Bar Graph
  if (shouldDraw && barCtx) {
    barCtx.fillStyle = document.body.style.getPropertyValue("--color-bg");
    barCtx.fillRect(0, 0, width, height);

    const blen = dataArray.length;

    /*
     * The dataArray has 2048 entries which represent 0 - 20 kHz linearly.
     * This means that the most interesting range of 0 - 1 kHz
     * is roughly in the first 100+ entries.
     */
    let x = 0;
    for (
      let i = 0;
      i < blen;
      /*
       * First ~1200 Hz = take all
       * Above ~1200 Hz = take 1 in 10
       *
       * Why? The point is to skip redundant information in the higher registers
       * so that an estimation of it fits in the graph.
       */
      i += i < 120 ? 1 : 10
    ) {
      /*
       *   First ~50  Hz            = 50px
       * Between ~51  Hz - ~150 Hz  = 50px
       * Between ~151 Hz - ~330 Hz  = 54px
       * Between ~331 Hz - ~1200 Hz = 106px
       *                            = 260px
       * Above ~1200 Hz             = 240px
       * Total                      = 500px
       *
       * Why? Most of the power in the signal is below 1.2 kHz.
       * That is what is interesting to see so we give it more pixels.
       * This gives us a rough "squarish" estimation of the real shape
       * without having to do interpolation.
       */
      const barWidth = i < 5 ? 10 : i < 15 ? 5 : i < 33 ? 3 : i < 120 ? 2 : 1;
      const barHeight = dataArray[i] * 2.3;

      barCtx.fillStyle = document.body.style.getPropertyValue(
        "--color-primary-highlight"
      );
      barCtx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth;
    }

    x = 0;
    lastDrawAt = Date.now();
  }

  // Peak meter
  if (shouldDraw && peakCtx) {
    const barWidth = 10;
    const barHeightMultiplier = 3;
    peakCtx.fillStyle = document.body.style.getPropertyValue("--color-bg");
    peakCtx.fillRect(0, 0, peakWidth, peakHeight);

    // LEFT

    // Compute average power over the interval.
    let sumOfSquares = 0;
    for (let i = 0; i < peakMeterBufferL.length; i++) {
      sumOfSquares += peakMeterBufferL[i] ** 2;
    }
    let avgPowerDecibels =
      10 * Math.log10(sumOfSquares / peakMeterBufferL.length);

    // Compute peak instantaneous power over the interval.
    let peakInstantaneousPower = 0;
    for (let i = 0; i < peakMeterBufferL.length; i++) {
      const power = peakMeterBufferL[i] ** 2;
      peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
    }
    let peakInstantaneousPowerDecibels =
      10 * Math.log10(peakInstantaneousPower);

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-secondary-highlight"
    );

    let barHeight = (100 + avgPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 5 - 4 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight
    );

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-primary-highlight"
    );

    barHeight = (100 + peakInstantaneousPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 5 - 3 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight
    );

    // RIGHT

    // Compute average power over the interval.
    sumOfSquares = 0;
    for (let i = 0; i < peakMeterBufferR.length; i++) {
      sumOfSquares += peakMeterBufferR[i] ** 2;
    }
    avgPowerDecibels = 10 * Math.log10(sumOfSquares / peakMeterBufferR.length);

    // Compute peak instantaneous power over the interval.
    peakInstantaneousPower = 0;
    for (let i = 0; i < peakMeterBufferR.length; i++) {
      const power = peakMeterBufferR[i] ** 2;
      peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
    }
    peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-secondary-highlight"
    );

    barHeight = (100 + avgPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 5 - 1 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight
    );

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-primary-highlight"
    );

    barHeight = (100 + peakInstantaneousPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 5 - 2 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight
    );
  }

  // Spectrograph
  if (shouldDraw && spectroCtx) {
    // Copy the current canvas onto the temp canvas
    tempCtx.drawImage(spectroCanvas, 0, 0, spectroWidth, spectroHeight);

    const getBarHeight = (i) =>
      i < 4 ? 5 : i < 8 ? 4 : i < 16 ? 3 : i < 64 ? 2 : 1;

    const getDv = (v) => v * 1.2;

    let xOffset = spectroWidth - 1;
    let yOffset = spectroHeight;

    for (let i = 0; i < dataArrayR.length; i += i < 50 ? 1 : 2) {
      const barHeight = getBarHeight(i);
      const dv = getDv(dataArrayR[i]);
      const r = dv;
      const g = dv;
      const b = dv;
      yOffset -= barHeight;
      spectroCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      spectroCtx.fillRect(xOffset, yOffset, 1, barHeight);
    }

    yOffset = spectroHeight - 200;

    for (let i = 0; i < dataArrayL.length; i += i < 50 ? 1 : 2) {
      const barHeight = getBarHeight(i);
      const dv = getDv(dataArrayL[i]);
      const r = dv;
      const g = dv;
      const b = dv;
      yOffset -= barHeight;
      spectroCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      spectroCtx.fillRect(xOffset, yOffset, 1, barHeight);
    }

    // Move the data on the canvas 1 pixel left so that next array fits
    spectroCtx.translate(-1, 0);

    // Draw the copied image
    spectroCtx.drawImage(
      tempCanvas,
      0,
      0,
      spectroWidth,
      spectroHeight,
      0,
      0,
      spectroWidth,
      spectroHeight
    );

    // Reset the transformation matrix
    spectroCtx.setTransform(1, 0, 0, 1, 0, 0);
  }

  return (
    <Container>
      <TopWrapper>
        <canvas id="barCanvas" width={width} height={height} />
        <canvas id="peakCanvas" width={peakWidth} height={peakHeight} />
      </TopWrapper>
      <canvas id="spectroCanvas" width={spectroWidth} height={spectroHeight} />
    </Container>
  );
};

export default connect(
  (state) => ({
    // Needed so that redux triggers an update and the updated dataArray can be read
    update: state.visualizer.update,
    dataArray: state.visualizer.dataArray,
    dataArrayL: state.visualizer.dataArrayL,
    dataArrayR: state.visualizer.dataArrayR,
    peakMeterBuffer: state.visualizer.peakMeterBuffer,
    peakMeterBufferL: state.visualizer.peakMeterBufferL,
    peakMeterBufferR: state.visualizer.peakMeterBufferR,
  }),
  (dispatch) => ({ dispatch })
)(Visualizer);
