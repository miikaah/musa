export const ADD_TOAST = "MUSA/TOASTER/ADD_TOAST";
export type AddToastAction = {
  type: typeof ADD_TOAST;
  message: string;
  key: string;
};
export const addToast = (message: string, key: string): AddToastAction => ({
  type: ADD_TOAST,
  message,
  key,
});

export const REMOVE_TOAST = "MUSA/TOASTER/REMOVE_TOAST";
export type RemoveToastAction = {
  type: typeof REMOVE_TOAST;
  key: string;
};
export const removeToast = (key: string): RemoveToastAction => ({
  type: REMOVE_TOAST,
  key,
});

export type ToasterState = {
  messages: Record<string, string>;
};

const initialState: ToasterState = {
  messages: {},
};

type ToasterAction = AddToastAction | RemoveToastAction;

const toaster = (state = initialState, action: ToasterAction) => {
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
