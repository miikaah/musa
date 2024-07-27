export const ADD_TOAST = "MUSA/TOASTER/ADD_TOAST" as const;
export const addToast = (message: string, key: string) => ({
  type: ADD_TOAST,
  message,
  key,
});

export const REMOVE_TOAST = "MUSA/TOASTER/REMOVE_TOAST" as const;
export const removeToast = (key: string) => ({
  type: REMOVE_TOAST,
  key,
});

export type ToasterState = {
  messages: Record<string, string>;
};

const initialState: ToasterState = {
  messages: {},
};

type ToasterAction =
  | ReturnType<typeof addToast>
  | ReturnType<typeof removeToast>;

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
      action satisfies never;
      return state;
  }
};

export default toaster;
