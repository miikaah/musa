import React, { useEffect, useState } from "react";
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
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components/macro";
import config, { FALLBACK_THEME } from "config";
import { updateSettings } from "reducers/settings.reducer";
import { setListingWithLabels } from "reducers/library.reducer";
import { updateCurrentTheme, dispatchToast } from "./util";
import Api from "api-client";
import AppMain from "views/AppMain";
import Settings from "views/Settings";
import Search from "views/Search";
import Titlebar from "components/Titlebar";
import Toolbar from "components/Toolbar";
import Toaster from "components/Toaster";
import ProgressBar from "components/ProgressBar";

const { isElectron } = config;

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
  faTrash,
  faAngleDown
);

const App = ({ dispatch }) => {
  const [isReady, setIsReady] = useState();

  useEffect(() => {
    const update = (settings) => {
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
      setIsReady(true);
    };

    Api.getSettings()
      .then(update)
      .then(() => Api.onInit())
      .then(() => {
        if (isElectron) {
          dispatchToast(
            "Updating library",
            `library-update-${Date.now()}`,
            dispatch
          );

          Api.getArtists().then((artists) =>
            dispatch(setListingWithLabels(artists))
          );
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Api.getArtists().then((artists) => dispatch(setListingWithLabels(artists)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return null;
  }

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
