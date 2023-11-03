import React from "react";
import { render as tlrRender } from "@testing-library/react";
import isValidProp from "@emotion/is-prop-valid";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { createStyledBreakpointsTheme } from "styled-breakpoints";
import rootReducer from "../src/reducers";
import { breakpointsAsPixels } from "../src/breakpoints";

const theme = createStyledBreakpointsTheme({
  breakpoints: breakpointsAsPixels,
});

export const render = (children: React.ReactElement, state: any) => {
  tlrRender(
    <StyleSheetManager
      shouldForwardProp={(propName, elementToBeRendered) => {
        return typeof elementToBeRendered === "string"
          ? isValidProp(propName)
          : true;
      }}
    >
      <ThemeProvider theme={theme}>
        <Provider store={createStore(rootReducer, state)}>{children}</Provider>
      </ThemeProvider>
    </StyleSheetManager>,
  );
};