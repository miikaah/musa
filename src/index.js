import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";
import App from "./App.jsx";
import Api from "api-client";

import "./index.css";

export const store = createStore(rootReducer);

store.subscribe(() => {
  const settings = store.getState().settings;

  if (settings.isInit) {
    Api.insertSettings({
      ...settings,
      isInit: null,
    });
  }
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
