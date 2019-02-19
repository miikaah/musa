export const TOGGLE = "MUSA/LIBRARY/TOGGLE";
export const toggleLibrary = () => ({
  type: TOGGLE
});

const initialState = {
  isVisible: true
};

const library = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: {
      console.log({
        ...state,
        isVisible: !state.isVisible
      });
      return {
        ...state,
        isVisible: !state.isVisible
      };
    }
    default:
      return state;
  }
};

export default library;
