import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import isEqual from "lodash.isequal";
import rootReducer from "./reducers";
import ErrorBoundary from "./ErrorBoundary";
import App from "./App.jsx";
import Api from "./apiClient";
import { SettingsState } from "./reducers/settings.reducer";

import "./index.css";

export const store = createStore(rootReducer);

let previousSettings: Partial<SettingsState>;
let timerId: NodeJS.Timeout;
store.subscribe(() => {
  const settings = { ...store.getState().settings } as Partial<SettingsState>;

  if (settings.isInit && !isEqual(previousSettings, settings)) {
    clearTimeout(timerId);

    // Delete functions because they can not be serialized to JSON
    delete settings.t;

    timerId = setTimeout(() => {
      Api.insertSettings({
        ...settings,
        isInit: null,
      });
    }, 2000);

    previousSettings = settings;
  }
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
);
