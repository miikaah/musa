import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components/macro";

/*
 * Square is a good shape for seeing the relative power differences
 * of different parts of the spectrum.
 */
const width = 500;
const spectroWidth = 455;
const peakWidth = 45;
const height = width;
const spectroHeight = height - 100;
const peakHeight = spectroHeight;

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

const BottomWrapper = styled.div``;

let lastDrawAt = Date.now();

const parseRgb = (rgb) =>
  rgb.replace("rgb(", "").replace(")", "").split(",").map(Number);

const rgb2hsl = (r, g, b) => {
  let d, h, l, max, min, s;
  r /= 255;
  g /= 255;
  b /= 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  h = 0;
  s = 0;
  l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        throw new Error("Reached default case in rgb2hsl");
    }
    h /= 6;
  }

  h = h * 360;

  return [h, s, l];
};

const hsl2rgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

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
    const barHeightMultiplier = Math.floor(peakHeight / 100);
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
    const rgb = parseRgb(
      document.body.style.getPropertyValue("--color-primary-highlight")
    );
    const [h, s] = rgb2hsl(...rgb);

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
      const [, , l] = rgb2hsl(dv, dv, dv);
      const [r, g, b] = hsl2rgb(h / 360, s * (1 / 2), l);
      yOffset -= barHeight;
      spectroCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      spectroCtx.fillRect(xOffset, yOffset, 1, barHeight);
    }

    yOffset = spectroHeight - 200;

    for (let i = 0; i < dataArrayL.length; i += i < 50 ? 1 : 2) {
      const barHeight = getBarHeight(i);
      const dv = getDv(dataArrayL[i]);
      const [, , l] = rgb2hsl(dv, dv, dv);
      const [r, g, b] = hsl2rgb(h / 360, s * (1 / 2), l);
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
      <canvas id="barCanvas" width={width} height={height} />
      <BottomWrapper>
        <canvas
          id="spectroCanvas"
          width={spectroWidth}
          height={spectroHeight}
        />
        <canvas id="peakCanvas" width={peakWidth} height={peakHeight} />
      </BottomWrapper>
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
