import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Playlist from "components/Playlist";
import Toolbar from "components/Toolbar";
import Toaster from "components/Toaster";
import Cover from "components/Cover";
import ProgressBar from "components/ProgressBar";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faBars,
  faCog,
  faSearch,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import { updateSettings } from "reducers/settings.reducer";
import { getStateFromIdb } from "./util";
import { breakpoint } from "./breakpoints";
import { get } from "lodash-es";
import { FALLBACK_THEME } from "./config";
import { webFrame } from "electron";

const listOverflow = css`
  max-height: 95vh;
  overflow-y: auto;

  @media (max-height: 800px) {
    max-height: 94vh;
  }

  @media (max-height: 600px) {
    max-height: 92vh;
  }
`;

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

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${breakpoint.lg}) {
    display: flex;
    flex-direction: column;
  }
`;

const AppCenter = styled.div`
  flex: 40%;
  padding: 0;
  height: 100vh;

  @media (max-width: ${breakpoint.lg}) {
    flex: 100%;
    padding: 0;
    ${listOverflow}
  }
`;

const AppRight = styled.div`
  flex: 60%;
  ${listOverflow}

  @media (max-width: ${breakpoint.lg}) {
    flex: 100%;
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
  faTrash
);

export const Colors = {
  Bg: "#21252b",
  Primary: "#753597",
  Secondary: "#21737e",
  Typography: "#fbfbfb",
  TypographyLight: "#000",
  DrGood: "#90ff00",
  DrMediocre: "#ffe02f",
  DrBad: "#f00",
  PrimaryRgb: [117, 53, 151],
  SliderTrack: "#424a56",
  SliderTrackRgb: [66, 74, 86],
  WhiteRgb: [255, 255, 255]
};

function clearWebFrameCache() {
  console.log("CLEAR WEBFRAME CACHE ", new Date().toISOString());
  webFrame.clearCache();
}

const ONE_MINUTE_MS = 60000;

setInterval(clearWebFrameCache, ONE_MINUTE_MS * 10);

const App = ({ dispatch }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const appCenterRef = useRef(null);
  const appRightRef = useRef(null);

  useEffect(() => {
    getStateFromIdb((req, db) => () =>
      dispatch(
        updateSettings({
          ...req.result,
          currentTheme: get(req, "result.defaultTheme", FALLBACK_THEME)
        })
      )
    );

    document.body.style.setProperty("--color-dr-level", Colors.Typography);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDragOver = event => event.preventDefault();

  const onDrop = event => {
    const item = JSON.parse(event.dataTransfer.getData("text"));
    if (Array.isArray(item)) {
      dispatch(pasteToPlaylist(item));
      return;
    }
    dispatch(addToPlaylist(item));
  };

  const renderCenterAndRight = isLarge => {
    const scroll = ref => {
      ref.current &&
        ref.current.scrollTo({
          top: ref.current.scrollTop + 200,
          behavior: "smooth"
        });
    };

    const scrollPlaylist = () => {
      isLarge ? scroll(appRightRef) : scroll(appCenterRef);
    };

    const renderPlaylist = () => <Playlist onScrollPlaylist={scrollPlaylist} />;

    return (
      <AppWrapper>
        <AppCenter ref={appCenterRef} onDragOver={onDragOver} onDrop={onDrop}>
          <Cover />
          {!isLarge && renderPlaylist()}
        </AppCenter>
        {isLarge && (
          <AppRight ref={appRightRef} onDragOver={onDragOver} onDrop={onDrop}>
            {renderPlaylist()}
          </AppRight>
        )}
      </AppWrapper>
    );
  };

  return (
    <AppContainer>
      <Toaster />
      <ProgressBar />
      <Toolbar />
      <div>{renderCenterAndRight(windowWidth > 1279)}</div>
    </AppContainer>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(App);
