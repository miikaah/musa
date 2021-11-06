export const ADD_TOAST = "MUSA/TOASTER/ADD_TOAST";
export const addToast = (message, key) => ({
  type: ADD_TOAST,
  message,
  key,
});

export const REMOVE_TOAST = "MUSA/TOASTER/REMOVE_TOAST";
export const removeToast = (key) => ({
  type: REMOVE_TOAST,
  key,
});

const initialState = {
  messages: {},
};

const toaster = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST: {
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.key]: action.message,
        },
      };
    }
    case REMOVE_TOAST: {
      return {
        ...state,
        messages: Object.entries(state.messages)
          .filter(([key]) => key !== action.key)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      };
    }
    default:
      return state;
  }
};

export default toaster;
