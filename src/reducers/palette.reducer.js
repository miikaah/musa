import { get } from "lodash-es";
import { Colors } from "../App.jsx";

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
      document.body.style.setProperty(
        "--color-bg",
        `rgb(${get(action, "swatch.rgb", Colors.Bg)})`
      );
      return {
        ...state,
        backgroundSwatch: action.swatch
      };
    }
    case SET_PRIMARY_HIGHLIGHT_SWATCH: {
      document.body.style.setProperty(
        "--color-primary-highlight",
        `rgb(${get(action, "swatch.rgb", Colors.Primary)})`
      );
      return {
        ...state,
        primaryHighlightSwatch: action.swatch
      };
    }
    case SET_SECONDARY_HIGHLIGHT_SWATCH: {
      document.body.style.setProperty(
        "--color-secondary-highlight",
        `rgb(${get(action, "swatch.rgb", Colors.Secondary)})`
      );
      return {
        ...state,
        secondaryHighlightSwatch: action.swatch
      };
    }
    case SET_TEXT_COLOR: {
      document.body.style.setProperty(
        "--color-typography",
        get(action, "color", Colors.Typography)
      );
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
