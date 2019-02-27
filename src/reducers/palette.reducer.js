export const SET_BACKGROUND_SWATCH = "MUSA/PALETTE/SET_BACKGROUND_SWATCH";
export const setBackgroundSwatch = swatch => ({
  type: SET_BACKGROUND_SWATCH,
  swatch
});

export const SET_PRIMARY_HIGHLIGHT_SWATCH =
  "MUSA/PALETTE/SET_PRIMARY_HIGHLIGHT_SWATCH";
export const setPrimaryHighlightSwatch = swatch => ({
  type: SET_PRIMARY_HIGHLIGHT_SWATCH,
  swatch
});

export const SET_SECONDARY_HIGHLIGHT_SWATCH =
  "MUSA/PALETTE/SET_SECONDARY_HIGHLIGHT_SWATCH";
export const setSecondaryHighlightSwatch = swatch => ({
  type: SET_SECONDARY_HIGHLIGHT_SWATCH,
  swatch
});

export const SET_TEXT_COLOR = "MUSA/PALETTE/SET_TEXT_COLOR";
export const setTextColor = color => ({
  type: SET_TEXT_COLOR,
  color
});

const initialState = {
  backgroundSwatch: {},
  primaryHighlightSwatch: {},
  secondaryHighlightSwatch: {},
  color: "#fff"
};

const palette = (state = initialState, action) => {
  switch (action.type) {
    case SET_BACKGROUND_SWATCH: {
      return {
        ...state,
        backgroundSwatch: action.swatch
      };
    }
    case SET_PRIMARY_HIGHLIGHT_SWATCH: {
      return {
        ...state,
        primaryHighlightSwatch: action.swatch
      };
    }
    case SET_SECONDARY_HIGHLIGHT_SWATCH: {
      return {
        ...state,
        secondaryHighlightSwatch: action.swatch
      };
    }
    case SET_TEXT_COLOR: {
      return {
        ...state,
        color: action.color
      };
    }
    default:
      return state;
  }
};

export default palette;
