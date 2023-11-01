type VisualizerData = {
  dataArray: Uint8Array;
  dataArrayL: Uint8Array;
  dataArrayR: Uint8Array;
  peakMeterBuffer: Float32Array;
  peakMeterBufferL: Float32Array;
  peakMeterBufferR: Float32Array;
};

export const SET_DATA = "MUSA/VISUALIZER/SET_DATA";
export type SetVisualizerDataAction = VisualizerData & {
  type: typeof SET_DATA;
};
export const setVisualizerData = ({
  dataArray,
  dataArrayL,
  dataArrayR,
  peakMeterBuffer,
  peakMeterBufferL,
  peakMeterBufferR,
}: VisualizerData) => ({
  type: SET_DATA,
  dataArray,
  dataArrayL,
  dataArrayR,
  peakMeterBuffer,
  peakMeterBufferL,
  peakMeterBufferR,
});

export type VisualizerState = VisualizerData & {
  update: 0 | 1;
};

const initialState = {
  update: 0,
  dataArray: new Uint8Array(128),
  dataArrayL: new Uint8Array(0),
  dataArrayR: new Uint8Array(0),
  peakMeterBuffer: new Float32Array(4096),
  peakMeterBufferL: new Float32Array(4096),
  peakMeterBufferR: new Float32Array(4096),
};

const visualizer = (state = initialState, action: SetVisualizerDataAction) => {
  switch (action.type) {
    case SET_DATA: {
      return {
        ...state,
        // Needed because the replacing of the dataArray does not trigger an update
        update: state.update ? 0 : 1,
        dataArray: action.dataArray,
        dataArrayL: action.dataArrayL,
        dataArrayR: action.dataArrayR,
        peakMeterBuffer: action.peakMeterBuffer,
        peakMeterBufferL: action.peakMeterBufferL,
        peakMeterBufferR: action.peakMeterBufferR,
      };
    }
    default:
      return state;
  }
};

export default visualizer;
