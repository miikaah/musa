import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import { useKeyPress } from "../hooks";
import { KEYS, isCtrlDown } from "../util";
import Library from "components/LibraryV2";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: var(--titlebar-height);
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--color-bg);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 16px;
  -webkit-app-region: drag;
`;

const buttonCss = css`
  width: 48px;
  height: 36px;
  outline: none;
  -webkit-app-region: no-drag;
  display: inline-block;
  position: relative;
  cursor: ${({ isMacOs }) => (isMacOs ? "default" : "pointer")};
`;

const MinButton = styled.div`
  ${buttonCss}

  :hover {
    background: #9b9b9b;

    > div {
      background: #fff;
    }
  }

  > div {
    height: 1px;
    width: 12px;
    background: var(--color-typography);
    position: absolute;
    top: 46%;
    left: 18px;
  }
`;

const MaxButton = styled.div`
  ${buttonCss}

  :hover {
    background: #9b9b9b;

    > div {
      border-color: #fff;
    }
  }

  > div {
    border-width: 1px;
    border-color: var(--color-typography);
    border-style: solid;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 30%;
    left: 18px;
  }
`;

const CloseButton = styled.div`
  ${buttonCss}

  :hover {
    background: #f11818;

    > div {
      background: #fff;
    }
  }

  > div {
    height: 1px;
    width: 15px;
    background: var(--color-typography);
    position: absolute;
    top: 46%;
    left: 17px;
  }

  > div:first-of-type {
    transform: rotate(45deg);
  }

  > div:last-of-type {
    transform: rotate(-45deg);
  }
`;

const buttonCss2 = css`
  font-size: 1.2rem;
  outline: none;
  -webkit-app-region: no-drag;
  width: 48px;
  height: 36px;
  cursor: ${({ isMacOs }) => (isMacOs ? "default" : "pointer")};
  color: ${({ isActive }) => (isActive ? "#fff" : "inherit")};
  background: ${({ isActive }) => (isActive ? "#9b9b9b" : "transparent")};

  :hover {
    color: #fff;
    background: #9b9b9b;
  }
`;

const LibraryButton = styled.button`
  ${buttonCss2}
`;

const SearchButton = styled.button`
  ${buttonCss2}
`;

const SettingsButton = styled.button`
  ${buttonCss2}
`;

const Title = styled.div`
  font-size: 0.9rem;
`;

const locationToTitleMap = {
  "/": "Musa",
  "/search": "Search",
  "/settings": "Settings",
};

const Titlebar = ({ location, history, currentLocation }) => {
  const [isMacOs, setIsMacOs] = useState(false);
  const [isLibraryVisible, setIsLibraryVisible] = useState(
    location.pathname === "/"
  );

  useEffect(() => {
    if (ipc) {
      ipc.once("musa:window:platform:response", (event, platform) => {
        setIsMacOs(platform === "darwin");
      });
      ipc.send("musa:window:platform:request");
    }
  });

  const libraryRef = useRef();
  const libraryButtonRef = useRef();
  const settingsButtonRef = useRef();
  const searchButtonRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (
        libraryButtonRef.current &&
        libraryButtonRef.current.contains(e.target)
      ) {
        return;
      }

      if (libraryRef.current && libraryRef.current.contains(e.target)) {
        return;
      }

      setIsLibraryVisible(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const goToSearchByKeyEvent = (event) => {
    if (!isCtrlDown(event)) {
      return;
    }

    if (location.pathname === "/search") {
      history.push("/");
      return;
    }

    history.push("/search");
    setIsLibraryVisible(false);
  };
  useKeyPress(KEYS.F, goToSearchByKeyEvent);

  const toggleLibrary = (event) => {
    libraryButtonRef.current.blur();

    if (location.pathname !== "/") {
      history.push("/");
      setIsLibraryVisible(true);
      return;
    }

    setIsLibraryVisible(!isLibraryVisible);
    event.stopPropagation();
  };

  const toggleSettings = (event) => {
    settingsButtonRef.current.blur();

    if (location.pathname === "/settings") {
      history.push("/");
    } else {
      history.push("/settings");
    }

    event.stopPropagation();
  };

  const toggleSearch = (event) => {
    searchButtonRef.current.blur();

    if (location.pathname === "/search") {
      history.push("/");
    } else {
      history.push("/search");
    }

    event.stopPropagation();
  };

  const minimize = () => {
    ipc.send("musa:window:minimize");
  };

  const maximize = () => {
    ipc.send("musa:window:maximize");
  };

  const unmaximize = () => {
    ipc.send("musa:window:unmaximize");
  };

  const maxOrUnMax = () => {
    ipc.once("musa:window:isMaximized:response", (event, isMaximized) => {
      if (isMaximized) {
        unmaximize();
      } else {
        maximize();
      }
    });
    ipc.send("musa:window:isMaximized:request");
  };

  const close = () => {
    ipc.send("musa:window:close");
  };

  return (
    <>
      <Library ref={libraryRef} isVisible={isLibraryVisible} />
      <Container>
        <div>
          <LibraryButton
            onClick={toggleLibrary}
            ref={libraryButtonRef}
            isMacOs={isMacOs}
            isActive={location.pathname === "/" && isLibraryVisible}
          >
            <FontAwesomeIcon icon="bars" />
          </LibraryButton>

          <SearchButton
            onClick={toggleSearch}
            ref={searchButtonRef}
            isMacOs={isMacOs}
            isActive={location.pathname === "/search"}
          >
            <FontAwesomeIcon icon="search" />
          </SearchButton>

          <SettingsButton
            onClick={toggleSettings}
            ref={settingsButtonRef}
            isMacOs={isMacOs}
            isActive={location.pathname === "/settings"}
          >
            <FontAwesomeIcon icon="cog" />
          </SettingsButton>
        </div>
        <Title>{locationToTitleMap[location.pathname]}</Title>
        {ipc && (
          <div>
            <MinButton onClick={minimize} isMacOs={isMacOs}>
              <div />
            </MinButton>
            <MaxButton onClick={maxOrUnMax} isMacOs={isMacOs}>
              <div />
            </MaxButton>
            <CloseButton onClick={close} isMacOs={isMacOs}>
              <div />
              <div />
            </CloseButton>
          </div>
        )}
      </Container>
    </>
  );
};

export default withRouter(
  connect(
    (state) => ({
      musicLibraryPath: state.settings.musicLibraryPath,
      currentLocation: state.settings.currentLocation,
    }),
    (dispatch) => ({ dispatch })
  )(Titlebar)
);
