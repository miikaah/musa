import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render as rtlRender } from "@testing-library/react";
import isValidProp from "@emotion/is-prop-valid";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { createStyledBreakpointsTheme } from "styled-breakpoints";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faBars,
  faCog,
  faSearch,
  faTrash,
  faAngleDown,
  faChevronLeft,
  faChevronRight,
  faLock,
  faLockOpen,
  faPencil,
  faChartColumn,
  faXmark,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import rootReducer from "../src/reducers";
import { breakpointsAsPixels } from "../src/breakpoints";

library.add(
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faBars,
  faCog,
  faSearch,
  faTrash,
  faAngleDown,
  faChevronLeft,
  faChevronRight,
  faLock,
  faLockOpen,
  faPencil,
  faChartColumn,
  faXmark,
  faShare,
);

const theme = createStyledBreakpointsTheme({
  breakpoints: breakpointsAsPixels,
});

export const render = (children: React.ReactElement, state: any) => {
  const store = createStore(rootReducer, state);

  rtlRender(
    <BrowserRouter>
      <StyleSheetManager
        shouldForwardProp={(propName, elementToBeRendered) => {
          return typeof elementToBeRendered === "string"
            ? isValidProp(propName)
            : true;
        }}
      >
        <ThemeProvider theme={theme}>
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
      </StyleSheetManager>
    </BrowserRouter>,
  );

  return { store };
};
