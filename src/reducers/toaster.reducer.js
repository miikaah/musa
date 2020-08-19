export const ADD_TOAST = "MUSA/TOASTER/ADD_TOAST";
export const addToast = (message, key) => ({
  type: ADD_TOAST,
  message,
  key,
});

export const ANIMATE_TOAST = "MUSA/TOASTER/ANIMATE_TOAST";
export const animateToast = (key) => ({
  type: ANIMATE_TOAST,
  key,
});

export const REMOVE_TOAST = "MUSA/TOASTER/REMOVE_TOAST";
export const removeToast = (key) => ({
  type: REMOVE_TOAST,
  key,
});

const initialState = {
  messages: new Map(),
};

const toaster = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST: {
      const newMessages = new Map(state.messages);
      newMessages.set(action.key, {
        msg: action.message,
        classes: ["toast-container"],
      });

      return {
        ...state,
        messages: newMessages,
      };
    }
    case ANIMATE_TOAST: {
      const newMessages = new Map(state.messages);
      const message = newMessages.get(action.key);
      newMessages.set(action.key, {
        ...message,
        classes: [...message.classes, "animate"],
      });

      return {
        ...state,
        messages: newMessages,
      };
    }
    case REMOVE_TOAST: {
      const newMessages = new Map(state.messages);
      newMessages.delete(action.key);

      return {
        ...state,
        messages: newMessages,
      };
    }
    default:
      return state;
  }
};

export default toaster;
