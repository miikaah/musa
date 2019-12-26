import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
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

library.add(faVolumeUp, faVolumeMute, faCog, faSearch, faTrash);

function clearWebFrameCache() {
  webFrame.clearCache();
}

const ONE_MINUTE_MS = 60000;

setInterval(clearWebFrameCache, ONE_MINUTE_MS * 10);

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const getSpotifyCodeFromQuery = () => {
  return window.location.search.split("?code=").pop();
};

const App = ({ dispatch }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateStateWithSpotifyTokens = () => {
    ipcRenderer.on(
      "GotSpotifyTokens",
      (event, spotify, spotifyRefreshToken) => {
        getStateFromIdb((req, db) => () => {
          const payload = {
            ...req.result,
            spotify,
            spotifyTokens: {
              ...req.result.spotifyTokens,
              access: spotify.accessToken
            }
          };
          if (spotifyRefreshToken) {
            payload.spotifyTokens.refresh = spotifyRefreshToken;
          }
          dispatch(updateSettings(payload));
        });
      }
    );
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateStateWithSpotifyTokens, []);

  const fetchSpotifyTokens = () => {
    getStateFromIdb((req, db) => () => {
      const code = getSpotifyCodeFromQuery();
      const refreshToken = get(req, "result.spotifyTokens.refresh");
      const spotify = get(req, "result.spotify", {});
      const expiresAt = spotify.expiresAt;

      if (!code) return;
      if (!expiresAt || !refreshToken) {
        ipcRenderer.send("SpotifyFetchTokens", code, "authorization_code");
      } else if (expiresAt < Date.now()) {
        ipcRenderer.send("SpotifyFetchTokens", refreshToken, "refresh_token");
      }
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchSpotifyTokens, []);

  const spotifyFailedDoRefresh = () => {
    ipcRenderer.on("SpotifyNotWorking", window.location.reload);
  };
  useEffect(spotifyFailedDoRefresh, []);

  const updateAppSettings = () => {
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
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateAppSettings, []);

  const handleResize = () => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };
  useEffect(handleResize, []);

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
