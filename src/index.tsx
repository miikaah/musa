import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import isEqual from "lodash.isequal";
import ErrorBoundary from "./ErrorBoundary";
import App from "./App.jsx";
import Api from "./apiClient";
import { SettingsState } from "./reducers/settings.reducer";
import { store } from "./store";

import "./index.css";
import { PlayerState } from "./reducers/player.reducer";

let previousSettings: Partial<SettingsState>;
let previousPlayer: Partial<PlayerState>;
let insertSettingsTimerId: NodeJS.Timeout;
let heartbeatMonitorTimerId: NodeJS.Timeout;

store.subscribe(() => {
  // TODO: Clean this up
  // @ts-ignore
  const player = { ...store.getState().player } as Partial<PlayerState>;

  // Turn on the heartbeat monitor when starting playing and close it in the opposite case
  if (
    origin.includes("fly.dev") &&
    !previousPlayer.isPlaying &&
    player.isPlaying
  ) {
    heartbeatMonitorTimerId = setInterval(async () => {
      await fetch(`${window.origin}/heartbeat`);
    }, 30_000);
  } else if (
    origin.includes("fly.dev") &&
    previousPlayer.isPlaying &&
    !player.isPlaying
  ) {
    clearInterval(heartbeatMonitorTimerId);
  }

  previousPlayer = player;

  const settings = { ...store.getState().settings } as Partial<SettingsState>;
  // Delete functions because they can not be serialized to JSON
  delete settings.t; // NOTE: It's IMPORTANT this stays here so that not is equal check works correctly

  if (settings.isInit && !isEqual(previousSettings, settings)) {
    clearTimeout(insertSettingsTimerId);

    insertSettingsTimerId = setTimeout(() => {
      Api.insertSettings({
        ...settings,
        isInit: null,
      });
    }, 1000);

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
