import React from "react";
import { screen, act } from "@testing-library/react";
import Visualizer from "./Visualizer";
import { audioFixture } from "../../fixtures/audio.fixture";
import { render } from "../../../test/render";
import { setVisualizerData } from "../../reducers/visualizer.reducer";
import { updateCurrentTheme } from "../../util";
import { FALLBACK_THEME } from "../../config";

vi.useFakeTimers();

class Canvas2dContextMock {
  drawImage() {}
  fillRect() {}
  translate() {}
  setTransform() {}
}

window.HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(new Canvas2dContextMock());

updateCurrentTheme(FALLBACK_THEME);

const data = {
  dataArray: new Uint8Array(128),
  dataArrayL: new Uint8Array(128),
  dataArrayR: new Uint8Array(128),
  peakMeterBuffer: new Float32Array(4096),
  peakMeterBufferL: new Float32Array(4096),
  peakMeterBufferR: new Float32Array(4096),
};

const state = {
  player: {
    currentItem: audioFixture,
  },
  visualizer: {
    update: 1,
    ...data,
  },
};

describe("Visualizer", () => {
  it("renders Visualizer component", async () => {
    const { store } = render(<Visualizer isVisible={true} />, state);

    expect(screen.getByTestId("VisualizerBarCanvas")).toBeInTheDocument();
    expect(screen.getByTestId("VisualizerSpectroCanvas")).toBeInTheDocument();
    expect(screen.getByTestId("VisualizerPeakCanvas")).toBeInTheDocument();

    vi.advanceTimersByTime(200);

    act(() => {
      store.dispatch(setVisualizerData(data));
    });
  });
});
