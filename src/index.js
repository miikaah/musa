import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";
import App from "./App.jsx";
import "./index.css";

const { REACT_APP_ENV, REACT_APP_API_BASE_URL: baseUrl } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

export const store = createStore(rootReducer);

store.subscribe(() => {
  const settings = store.getState().settings;

  if (ipc) {
    if (settings.isInit) {
      ipc.send("musa:settings:request:insert", {
        ...settings,
        isInit: null,
      });
    }
  } else {
    if (settings.isInit) {
      fetch(`${baseUrl}/state`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            ...settings,
            isInit: null,
          },
        }),
      });
    }
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
