import React, { useEffect } from "react";
import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
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
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components/macro";
import { FALLBACK_THEME } from "./config";
import { updateSettings } from "reducers/settings.reducer";
import { setListingWithLabels } from "reducers/library.reducer";
import { updateCurrentTheme, dispatchToast } from "./util";
import AppMain from "views/AppMain";
import Settings from "views/Settings";
import Search from "views/Search";
import Titlebar from "components/Titlebar";
import Toolbar from "components/Toolbar";
import Toaster from "components/Toaster";
import ProgressBar from "components/ProgressBar";

const { REACT_APP_ENV, REACT_APP_API_BASE_URL: baseUrl } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const AppContainer = styled.div`
  text-align: left;
  background-color: var(--color-bg);
  min-height: 100vh;
  max-height: 100vh;
  min-width: 360px;
  overflow: hidden;
  color: var(--color-typography);
  user-select: none;
`;

library.add(
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faBars,
  faCog,
  faSearch,
  faTrash
);

const App = ({ dispatch }) => {
  useEffect(() => {
    if (ipc) {
      ipc.once("musa:settings:response:get", (event, settings) => {
        const currentTheme = settings?.currentTheme?.colors
          ? settings?.currentTheme
          : {
              colors: FALLBACK_THEME,
            };

        updateCurrentTheme(currentTheme?.colors);
        dispatch(
          updateSettings({
            ...settings,
            isInit: true,
            currentTheme,
          })
        );
      });
      ipc.send("musa:settings:request:get");

      ipc.once("musa:ready", (event) => {
        dispatchToast(
          "Updating library",
          `library-update-${Date.now()}`,
          dispatch
        );
        ipc.send("musa:artists:request");
        ipc.send("musa:scan");
      });
      ipc.send("musa:onInit");
    } else {
      fetch(`${baseUrl}/settings`)
        .then((response) => response.json())
        .then((settings) => {
          const currentTheme = settings?.currentTheme || FALLBACK_THEME;

          updateCurrentTheme(currentTheme);

          if (settings.currentTheme) {
            dispatch(
              updateSettings({
                ...settings,
                isInit: true,
                currentTheme,
              })
            );
          } else {
            dispatch(
              updateSettings({
                isInit: true,
                currentTheme,
              })
            );
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ipc) {
      ipc.on("musa:artists:response", (event, artists) => {
        dispatch(setListingWithLabels(artists));
      });
      ipc.send("musa:artists:request");
    } else {
      fetch(`${baseUrl}/artists`)
        .then((response) => response.json())
        .then((artists) => {
          dispatch(setListingWithLabels(artists));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Main = () => (
    <AppContainer>
      <Toaster />
      <Titlebar />
      <ProgressBar />
      <Toolbar />
      <Switch>
        <Route exact path="/" component={AppMain} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </AppContainer>
  );

  return isElectron ? (
    <HashRouter>
      <Main />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(App);
