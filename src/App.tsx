import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
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
import styled, { StyleSheetManager, ThemeProvider } from "styled-components";
import isValidProp from "@emotion/is-prop-valid";
import { createStyledBreakpointsTheme } from "styled-breakpoints";
import { isElectron, FALLBACK_THEME } from "./config";
import {
  Settings as SettingsData,
  updateSettings,
} from "./reducers/settings.reducer";
import { setScanProps, setListingWithLabels } from "./reducers/library.reducer";
import { updateCurrentProfile } from "./reducers/profile.reducer";
import {
  updateCurrentTheme,
  dispatchToast,
  getQueryStringAsObject,
} from "./util";
import { breakpointsAsPixels } from "./breakpoints";
import * as Api from "./apiClient";
import AppMain from "./views/AppMain";
import Settings from "./views/Settings";
import Search from "./views/Search";
import Titlebar from "./components/Titlebar";
import Toolbar from "./components/Toolbar";
import Toaster from "./components/Toaster";
import ProgressBar from "./components/ProgressBar";
import { pasteToPlaylist } from "./reducers/player.reducer";
import { SettingsState } from "./reducers/settings.reducer";
import { TranslateFn } from "./i18n";

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

// This should never be re-rendered from this level as changing the language
// triggers a re-render for the App component but that screws up the Player
// component which is inside of Toolbar component, which causes playing
// to restart. The Player component should NEVER be re-rendered because
// it has an AudioContext that breaks the app if it is reconnected.
const Main = React.memo(() => (
  <StyleSheetManager
    shouldForwardProp={(propName, elementToBeRendered) => {
      return typeof elementToBeRendered === "string"
        ? isValidProp(propName)
        : true;
    }}
  >
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Toaster />
        <Titlebar />
        <ProgressBar />
        <Toolbar />
        <Routes>
          <Route path="/" element={<AppMain />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </AppContainer>
    </ThemeProvider>
  </StyleSheetManager>
));

type AppProps = {
  isInit: SettingsState["isInit"];
  t: TranslateFn;
  dispatch: Dispatch;
};

const App = ({ isInit, t, dispatch }: AppProps) => {
  const [isReady, setIsReady] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // This block has to run after settings have been fetched
    // so that the correct language has been loaded
    if (isReady || !isInit) {
      return;
    }

    if (isElectron) {
      dispatchToast(
        t("toast.updatingLibrary"),
        `library-update-${Date.now()}`,
        dispatch,
      );
    }

    Api.addScanCompleteListener(() => {
      dispatchToast(t("toast.updateComplete"), "update-complete", dispatch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  useEffect(() => {
    const update = (settings: SettingsData) => {
      const currentTheme = settings?.currentTheme?.colors
        ? settings?.currentTheme
        : {
            colors: FALLBACK_THEME,
            filename: "",
            id: "",
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
  (state: { settings: SettingsState }) => ({
    isInit: state.settings.isInit,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(App);
