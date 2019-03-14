export const TOGGLE = "MUSA/SETTINGS/TOGGLE";
export const toggleSettings = () => ({
  type: TOGGLE
});

const initialState = {
  isVisible: false
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: {
      return {
        ...state,
        isVisible: !state.isVisible
      };
    }
    default:
      return state;
  }
};

export default settings;
