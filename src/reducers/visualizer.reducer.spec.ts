import reducer, { setVisualizerData } from "./visualizer.reducer";

const data = {
  dataArray: new Uint8Array(128),
  dataArrayL: new Uint8Array(0),
  dataArrayR: new Uint8Array(0),
  peakMeterBuffer: new Float32Array(4096),
  peakMeterBufferL: new Float32Array(4096),
  peakMeterBufferR: new Float32Array(4096),
};

describe("Visualizer reducer", () => {
  it("updates visualizer data", () => {
    expect(reducer(undefined, setVisualizerData(data))).toEqual({
      update: 1,
      ...data,
    });
  });

  it("toggles update between 0 and 1", () => {
    expect(reducer(undefined, setVisualizerData(data))).toEqual({
      update: 1,
      ...data,
    });
    expect(reducer({ update: 1, ...data }, setVisualizerData(data))).toEqual({
      update: 0,
      ...data,
    });
  });
});
