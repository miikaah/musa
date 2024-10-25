import { RgbColor } from "@miikaah/musa-core";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { rgb2hsl, hsl2rgb } from "../../colors";
import { VisualizerState } from "../../reducers/visualizer.reducer";
import { PlayerState } from "../../reducers/player.reducer";
import * as Api from "../../apiClient";

/*
 * Square is a good shape for seeing the relative power differences
 * of different parts of the spectrum.
 */
const width = 500;
const height = width;
const spectroWidth = 460;
const spectroHeight = height - 100;
const peakWidth = 40;
const peakHeight = spectroHeight;

let spectroCanvas: HTMLCanvasElement;
let tempCanvas: HTMLCanvasElement;
let barCtx: CanvasRenderingContext2D;
let peakCtx: CanvasRenderingContext2D;
let spectroCtx: CanvasRenderingContext2D;
let tempCtx: CanvasRenderingContext2D;

const Container = styled.div<{ isVisible: boolean }>`
  overflow: auto;
  max-height: ${({ isVisible }) => (isVisible ? "900px" : "0")};
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  padding-bottom: 160px; /* TODO: Ought to be calculated by viewport height */

  &::-webkit-scrollbar {
    width: 0;
  }
  scrollbar-width: none; /* Firefox */

  > canvas {
    display: block;
  }
`;

const BottomWrapper = styled.div``;

let lastDrawAt = Date.now();

const parseRgb = (rgb: string): RgbColor =>
  rgb.replace("rgb(", "").replace(")", "").split(",").map(Number) as RgbColor;

let lockSpectroGraph = false;

function downsample(data: any, bucketSize: number) {
  const downsampledData = [];

  for (let i = 0; i < data.length; i += bucketSize) {
    let sum = 0;
    let count = 0;

    for (let j = i; j < i + bucketSize && j < data.length; j++) {
      sum += data[j];
      count++;
    }

    const avg = sum / count;
    downsampledData.push(avg);
  }

  return downsampledData;
}

function linearInterpolate(data: any) {
  const interpolatedData = [];

  for (let i = 0; i < 120; i++) {
    interpolatedData.push(data[i]);
    const midPoint = (data[i] + data[i + 1]) / 2;
    if (i < 12) {
      const b = (data[i] + midPoint) / 2;
      const a = (data[i] + b) / 2;
      const c = (b + midPoint) / 2;
      const f = (midPoint + data[i + 1]) / 2;
      const e = (midPoint + f) / 2;
      const g = (f + data[i + 1]) / 2;
      interpolatedData.push(a, b, c, midPoint, e, f, g);
    } else if (i < 33) {
      const leftMidPoint = (data[i] + midPoint) / 2;
      const rightMidPoint = (midPoint + data[i + 1]) / 2;
      interpolatedData.push(leftMidPoint, midPoint, rightMidPoint);
    } else {
      interpolatedData.push(midPoint);
    }
  }

  return [...interpolatedData, ...downsample(data.slice(120), 11)];
}

type VisualizerProps = {
  isVisible: boolean;
  update: 0 | 1;
  dataArray: VisualizerState["dataArray"];
  dataArrayL: VisualizerState["dataArrayL"];
  dataArrayR: VisualizerState["dataArrayR"];
  peakMeterBufferL: VisualizerState["peakMeterBufferL"];
  peakMeterBufferR: VisualizerState["peakMeterBufferR"];
  currentItem: PlayerState["currentItem"];
  isPlaying: boolean;
};

const Visualizer = ({
  isVisible,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update, // Triggers update
  dataArray,
  dataArrayL,
  dataArrayR,
  peakMeterBufferL,
  peakMeterBufferR,
  currentItem,
  isPlaying,
}: VisualizerProps) => {
  const location = useLocation();
  const shouldDraw =
    isVisible && location.pathname === "/" && Date.now() - lastDrawAt > 16;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const barCanvas = document.getElementById("barCanvas") as HTMLCanvasElement;
    barCtx = barCanvas.getContext("2d") as CanvasRenderingContext2D;
    const peakCanvas = document.getElementById(
      "peakCanvas",
    ) as HTMLCanvasElement;
    peakCtx = peakCanvas.getContext("2d") as CanvasRenderingContext2D;
    spectroCanvas = document.getElementById(
      "spectroCanvas",
    ) as HTMLCanvasElement;
    spectroCtx = spectroCanvas.getContext("2d") as CanvasRenderingContext2D;
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = spectroWidth;
    tempCanvas.height = spectroHeight;
    tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
  }, []);

  // HACK: On Linux the temp canvas stops working after suspend,
  //       so wasting CPU here to actually get the spectrograph working at least.
  useEffect(() => {
    if (isPlaying) {
      Api.getPlatform()
        .then((platform) => {
          if (platform !== "linux") return;

          tempCanvas = document.createElement("canvas");
          tempCanvas.width = spectroWidth;
          tempCanvas.height = spectroHeight;
          tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;

          intervalRef.current = setInterval(() => {
            tempCanvas = document.createElement("canvas");
            tempCanvas.width = spectroWidth;
            tempCanvas.height = spectroHeight;
            tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
          }, 5000);
        })
        .catch(console.error);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!spectroCtx) {
      return;
    }

    // Wipe the spectrograph so that conflicting colors don't
    // hang around too long
    spectroCtx.fillStyle = "black";
    spectroCtx.fillRect(0, 0, spectroWidth, spectroHeight);
    lockSpectroGraph = true;

    // There is a slight delay in switching to a new song
    // so previous song's spectrum with previous colors keeps being drawn for that time.
    // Lock the spectrograph for some time so that doesn't happen.
    setTimeout(() => {
      lockSpectroGraph = false;
    }, 150);
  }, [currentItem]);

  // Bar Graph
  if (shouldDraw && barCtx) {
    barCtx.fillStyle = document.body.style.getPropertyValue("--color-bg");
    barCtx.fillRect(0, 0, width, height);

    const interpolated = linearInterpolate(dataArray);
    const blen = dataArray.length;

    /*
     * The dataArray has 2048 entries which represent 0 - 20 kHz linearly.
     * This means that the most interesting range of 0 - 1 kHz
     * is roughly in the first 100+ entries.
     */
    let x = 0;
    for (let i = 0; i < blen; i++) {
      const barWidth = 1;
      const barHeight = interpolated[i] * 2.3; // The magic number just works, trust me bro

      barCtx.fillStyle = document.body.style.getPropertyValue(
        "--color-primary-highlight",
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
      "--color-secondary-highlight",
    );

    let barHeight = (100 + avgPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 4 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight,
    );

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-primary-highlight",
    );

    barHeight = (100 + peakInstantaneousPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 3 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight,
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
      "--color-secondary-highlight",
    );

    barHeight = (100 + avgPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 1 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight,
    );

    peakCtx.fillStyle = document.body.style.getPropertyValue(
      "--color-primary-highlight",
    );

    barHeight = (100 + peakInstantaneousPowerDecibels) * barHeightMultiplier;
    peakCtx.fillRect(
      peakWidth - 2 * barWidth,
      peakHeight - barHeight,
      barWidth,
      barHeight,
    );
  }

  // Spectrograph
  if (shouldDraw && spectroCtx && !lockSpectroGraph) {
    const rgb = parseRgb(
      document.body.style.getPropertyValue("--color-primary-highlight"),
    );
    const [h, s] = rgb2hsl(...rgb);

    // Copy the current canvas onto the temp canvas
    tempCtx.drawImage(spectroCanvas, 0, 0, spectroWidth, spectroHeight);

    const getBarHeight = (i: number) => (i < 8 ? 4 : i < 32 ? 2 : 1);

    // The multiplier sets the overall brightness. Minus increases contrast.
    const getDv = (v: number) => (v < 70 ? v - 10 : v * 1.2);

    let xOffset = spectroWidth - 1;
    let yOffset = spectroHeight;

    for (let i = 0; i < dataArrayR.length; i += i < 87 ? 1 : 24) {
      const barHeight = getBarHeight(i);
      const dv = getDv(dataArrayR[i]);
      const [, , l] = rgb2hsl(dv, dv, dv);
      const [r, g, b] = hsl2rgb(h / 360, s * (1 / 2), l);
      yOffset -= barHeight;
      spectroCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      spectroCtx.fillRect(xOffset, yOffset, 1, barHeight);
    }

    yOffset = spectroHeight - 200;

    for (let i = 0; i < dataArrayL.length; i += i < 87 ? 1 : 24) {
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
      spectroHeight,
    );

    // Reset the transformation matrix
    spectroCtx.setTransform(1, 0, 0, 1, 0, 0);
  }

  return (
    <Container isVisible={isVisible} data-testid="VisualizerContainer">
      <canvas
        id="barCanvas"
        width={width}
        height={height}
        data-testid="VisualizerBarCanvas"
      />
      <BottomWrapper>
        <canvas
          id="spectroCanvas"
          width={spectroWidth}
          height={spectroHeight}
          data-testid="VisualizerSpectroCanvas"
        />
        <canvas
          id="peakCanvas"
          width={peakWidth}
          height={peakHeight}
          data-testid="VisualizerPeakCanvas"
        />
      </BottomWrapper>
    </Container>
  );
};

export default connect(
  (state: { visualizer: VisualizerState; player: PlayerState }) => ({
    // Needed so that redux triggers an update and the updated dataArray can be read
    update: state.visualizer.update,
    dataArray: state.visualizer.dataArray,
    dataArrayL: state.visualizer.dataArrayL,
    dataArrayR: state.visualizer.dataArrayR,
    peakMeterBuffer: state.visualizer.peakMeterBuffer,
    peakMeterBufferL: state.visualizer.peakMeterBufferL,
    peakMeterBufferR: state.visualizer.peakMeterBufferR,
    currentItem: state.player.currentItem,
    isPlaying: state.player.isPlaying,
  }),
)(Visualizer);
