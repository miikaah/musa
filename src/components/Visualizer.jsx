import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components/macro";

/*
 * Square is a good shape for seeing the relative power differences
 * of different parts of the spectrum.
 */
const width = 500;
const height = width;

let ctx;

const Container = styled.div`
  overflow: hidden;
`;

let lastDrawAt = Date.now();

const Visualizer = ({ dispatch, forwardRef, isVisible, update, dataArray }) => {
  const location = useLocation();

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
  }, []);

  // Bar Graph
  if (
    ctx &&
    isVisible &&
    location.pathname === "/" &&
    Date.now() - lastDrawAt > 16
  ) {
    ctx.fillStyle = document.body.style.getPropertyValue("--color-bg");
    ctx.fillRect(0, 0, width, height);

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

      ctx.fillStyle = document.body.style.getPropertyValue(
        "--color-primary-highlight"
      );
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth;
    }

    x = 0;
    lastDrawAt = Date.now();
  }

  return (
    <Container>
      <canvas width={width} height={height} />
    </Container>
  );
};

export default connect(
  (state) => ({
    // Needed so that redux triggers an update and the updated dataArray can be read
    update: state.visualizer.update,
    dataArray: state.visualizer.dataArray,
  }),
  (dispatch) => ({ dispatch })
)(Visualizer);
