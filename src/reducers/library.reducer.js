export const TOGGLE = "MUSA/LIBRARY/TOGGLE";
export const toggleLibrary = () => ({
  type: TOGGLE
});

export const HIDE = "MUSA/LIBRARY/HIDE";
export const hideLibrary = () => ({
  type: HIDE
});

const initialState = {
  isVisible: true
};

const library = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: {
      return {
        ...state,
        isVisible: !state.isVisible
      };
    }
    case HIDE: {
      return {
        ...state,
        isVisible: false
      };
    }
    default:
      return state;
  }
};

export default library;
