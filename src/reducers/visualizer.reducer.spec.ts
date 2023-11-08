import reducer, { setVisualizerData } from "./visualizer.reducer";

describe("Visualizer reducer", () => {
  it("updates visualizer data", () => {
    const data = {
      dataArray: new Uint8Array(128),
      dataArrayL: new Uint8Array(0),
      dataArrayR: new Uint8Array(0),
      peakMeterBuffer: new Float32Array(4096),
      peakMeterBufferL: new Float32Array(4096),
      peakMeterBufferR: new Float32Array(4096),
    };

    expect(reducer(undefined, setVisualizerData(data))).toEqual({
      update: 1,
      ...data,
    });
  });
});
