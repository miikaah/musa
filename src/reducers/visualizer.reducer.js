export const SET_DATA_ARRAY = "MUSA/VISUALIZER/SET_DATA_ARRAY";
export const setDataArray = (dataArray) => ({
  type: SET_DATA_ARRAY,
  dataArray,
});

const initialState = {
  update: 0,
  dataArray: new Uint8Array(128),
};

const visualizer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_ARRAY: {
      return {
        ...state,
        // Needed because the replacing of the dataArray does not trigger an update
        update: state.update ? 0 : 1,
        dataArray: action.dataArray,
      };
    }
    default:
      return state;
  }
};

export default visualizer;
