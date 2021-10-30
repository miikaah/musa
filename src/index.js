import React from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
