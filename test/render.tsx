import React from "react";
import { render as tlrRender } from "@testing-library/react";
import isValidProp from "@emotion/is-prop-valid";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StyleSheetManager } from "styled-components";
import rootReducer from "../src/reducers";

export const render = (children: React.ReactElement, state: any) => {
  tlrRender(
    <StyleSheetManager
      shouldForwardProp={(propName, elementToBeRendered) => {
        return typeof elementToBeRendered === "string"
          ? isValidProp(propName)
          : true;
      }}
    >
      <Provider store={createStore(rootReducer, state)}>{children}</Provider>
    </StyleSheetManager>,
  );
};
