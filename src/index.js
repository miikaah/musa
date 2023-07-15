import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import isEqual from "lodash.isequal";
import rootReducer from "./reducers";
import ErrorBoundary from "./ErrorBoundary";
import App from "./App.jsx";
import Api from "api-client";

import "./index.css";

export const store = createStore(rootReducer);

let previousSettings;
store.subscribe(() => {
  const settings = store.getState().settings;

  if (settings.isInit && !isEqual(previousSettings, settings)) {
    Api.insertSettings({
      ...settings,
      isInit: null,
    });
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

// Live reload for esbuild
new EventSource("/esbuild").addEventListener("change", () => location.reload());
