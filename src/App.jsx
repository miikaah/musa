import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCog,
  faSearch,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components/macro";
import { get } from "lodash-es";
import { webFrame } from "electron";
import { FALLBACK_THEME } from "./config";
import { updateSettings } from "reducers/settings.reducer";
import { updateCurrentTheme, getStateFromIdb } from "./util";
import { breakpointLg } from "./breakpoints";
import AppMain from "views/AppMain";
import Settings from "views/Settings";
import Search from "views/Search";
import Toolbar from "components/Toolbar";
import Toaster from "components/Toaster";
import ProgressBar from "components/ProgressBar";

const AppContainer = styled.div`
  text-align: left;
  background-color: var(--color-bg);
  min-height: 100vh;
  max-height: 100vh;
  min-width: 360px;
  overflow: auto;
  color: var(--color-typography);
  user-select: none;
`;

library.add(
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faCog,
  faSearch,
  faTrash
);

function clearWebFrameCache() {
  webFrame.clearCache();
}

const ONE_MINUTE_MS = 60000;

setInterval(clearWebFrameCache, ONE_MINUTE_MS * 10);

const App = ({ dispatch }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    getStateFromIdb((req, db) => () => {
      const currentTheme = get(req, "result.defaultTheme", FALLBACK_THEME);
      updateCurrentTheme(currentTheme);
      dispatch(
        updateSettings({
          ...req.result,
          currentTheme
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <AppContainer>
        <Toaster />
        <ProgressBar />
        <Toolbar />
        <Switch>
          <Route
            exact
            path="/"
            component={() => <AppMain isLarge={windowWidth > breakpointLg} />}
          />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </AppContainer>
    </Router>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(App);
