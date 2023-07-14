import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
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
  faChevronLeft,
  faChevronRight,
  faLock,
  faLockOpen,
  faPencil,
  faChartColumn,
  faXmark,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import styled, { ThemeProvider } from "styled-components/macro";
import { createStyledBreakpointsTheme } from "styled-breakpoints";
import config, { FALLBACK_THEME } from "config";
import { updateSettings } from "reducers/settings.reducer";
import { setScanProps, setListingWithLabels } from "reducers/library.reducer";
import { updateCurrentProfile } from "reducers/profile.reducer";
import {
  updateCurrentTheme,
  dispatchToast,
  getQueryStringAsObject,
} from "./util";
import { breakpointsAsPixels } from "breakpoints";
import Api from "api-client";
import AppMain from "views/AppMain";
import Settings from "views/Settings";
import Search from "views/Search";
import Titlebar from "components/Titlebar";
import Toolbar from "components/Toolbar";
import Toaster from "components/Toaster";
import ProgressBar from "components/ProgressBar";
import { pasteToPlaylist } from "reducers/player.reducer";

const { isElectron } = config;

const theme = createStyledBreakpointsTheme({
  breakpoints: breakpointsAsPixels,
});

const AppContainer = styled.div`
  text-align: left;
  background-color: var(--color-bg);
  min-height: 100vh;
  max-height: 100vh;
  min-width: 360px;
  overflow: hidden;
  color: var(--color-typography);
  user-select: none;

  ${({ theme }) => theme.breakpoints.down("md")} {
    overflow-x: hidden;
    overflow-y: auto;
  }
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
  faAngleDown,
  faChevronLeft,
  faChevronRight,
  faLock,
  faLockOpen,
  faPencil,
  faChartColumn,
  faXmark,
  faShare,
);

const App = ({ dispatch }) => {
  const [isReady, setIsReady] = useState();

  useEffect(() => {
    Api.addScanStartListener(({ scanLength, scanColor }) => {
      dispatch(setScanProps({ scanLength, scanColor }));
    });
    Api.addScanUpdateListener(({ scannedLength }) => {
      dispatch(setScanProps({ scannedLength }));
    });
    Api.addScanEndListener(() => {
      dispatch(setScanProps({ reset: true }));
    });
    Api.addScanCompleteListener(() => {
      dispatchToast("Update complete", "update-complete", dispatch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        }),
      );

      const profile = settings.currentProfile;
      dispatch(updateCurrentProfile(profile));

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
            dispatch,
          );

          Api.getArtists().then((artists) =>
            dispatch(setListingWithLabels(artists)),
          );
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Api.getArtists().then((artists) => dispatch(setListingWithLabels(artists)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = getQueryStringAsObject(window.location.href);

    if (query?.pl) {
      Api.getPlaylistAudios(query.pl).then((audios) => {
        dispatch(pasteToPlaylist(audios));
        window.history.pushState(
          null,
          "Musa",
          window.location.href.split("?")[0],
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return null;
  }

  const Main = () => (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Toaster />
        <Titlebar />
        <ProgressBar />
        <Toolbar />
        <Routes>
          <Route exact path="/" element={<AppMain />} />
          <Route exact path="/settings" element={<Settings />} />
          <Route exact path="/search" element={<Search />} />
        </Routes>
      </AppContainer>
    </ThemeProvider>
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
  (dispatch) => ({ dispatch }),
)(App);
