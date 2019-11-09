import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";
import App from "./App.jsx";
import { getStateFromIdb, updateStateInIdb } from "./util";
import "./index.css";

export const store = createStore(rootReducer);

store.subscribe(() => {
  getStateFromIdb((req, db) => () =>
    updateStateInIdb(req, db, store.getState().settings)
  );
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
