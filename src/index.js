import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import isEqual from "lodash.isequal";
import rootReducer from "./reducers";
import ErrorBoundary from "./ErrorBoundary";
import App from "./App.jsx";
import Api from "apiClient";

import "./index.css";

export const store = createStore(rootReducer);

let previousSettings;
let timerId;
store.subscribe(() => {
  const settings = store.getState().settings;

  if (settings.isInit && !isEqual(previousSettings, settings)) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      Api.insertSettings({
        ...settings,
        isInit: null,
      });
    }, 2000);

    previousSettings = settings;
  }
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
);

if (process.env.NODE_ENV === "development") {
  // Live reload for esbuild
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  );
}
