import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPress } from "../hooks";
import { KEYS, isCtrlDown } from "../util";
import Library from "components/LibraryV2";
import { breakpoint } from "../breakpoints";
import config from "config";
import Api from "api-client";

const { isElectron } = config;

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

  background: ${({ isActive, isSmall }) =>
    isActive && isSmall ? "#9b9b9b" : "transparent"};
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

const ActionsContainer = styled.div`
  visibility: ${({ isElectron }) => (isElectron ? "visible" : "hidden")};
`;

const locationToTitleMap = {
  "/": "Musa",
  "/search": "Search",
  "/search/": "Search",
  "/settings": "Settings",
  "/settings/": "Settings",
};

const Titlebar = ({ currentLocation }) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint.lg);
  const [isMacOs, setIsMacOs] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLibraryVisible, setIsLibraryVisible] = useState(
    location.pathname === "/" || window.innerWidth > breakpoint.lg
  );

  useEffect(() => {
    if (isElectron) {
      Api.getPlatform().then((platform) => setIsMacOs(platform === "darwin"));
    }
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      const izSmall = window.innerWidth < breakpoint.lg;

      setIsSmall(izSmall);
      setIsLibraryVisible(!izSmall);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const libraryRef = useRef();
  const libraryButtonRef = useRef();
  const settingsButtonRef = useRef();
  const searchButtonRef = useRef();

  useEffect(() => {
    // Close library when clicking outside it like the playlist
    const handleClick = (e) => {
      if (!isSmall) {
        return;
      }

      if (
        libraryButtonRef.current &&
        libraryButtonRef.current.contains(e.target)
      ) {
        return;
      }

      if (libraryRef.current && libraryRef.current.contains(e.target)) {
        return;
      }

      if (location.pathname === "/") {
        setIsLibraryVisible(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isSmall, location]);

  const goToSearchByKeyEvent = (event) => {
    if (!isCtrlDown(event)) {
      return;
    }

    if (location.pathname === "/search") {
      navigate("/");
      return;
    }

    navigate("/search");
  };
  useKeyPress(KEYS.F, goToSearchByKeyEvent);

  const toggleLibrary = (event) => {
    libraryButtonRef.current.blur();

    if (location.pathname !== "/") {
      navigate("/");

      if (!isSmall) {
        setIsLibraryVisible(true);
      }
      return;
    }

    if (!isSmall) {
      return;
    }

    setIsLibraryVisible(!isLibraryVisible);
    event.stopPropagation();
  };

  const toggleSettings = (event) => {
    settingsButtonRef.current.blur();

    if (location.pathname.startsWith("/settings")) {
      navigate("/");
    } else {
      navigate("/settings");
    }

    event.stopPropagation();
  };

  const toggleSearch = (event) => {
    searchButtonRef.current.blur();

    if (location.pathname.startsWith("/search")) {
      navigate("/");
    } else {
      navigate("/search");
    }

    event.stopPropagation();
  };

  const minimize = () => {
    Api.minimizeWindow();
  };

  const maximize = () => {
    Api.maximizeWindow();
  };

  const unmaximize = () => {
    Api.unmaximizeWindow();
  };

  const maxOrUnMax = async () => {
    const isMaximized = await Api.isWindowMaximized();

    if (isMaximized) {
      unmaximize();
    } else {
      maximize();
    }
  };

  const close = () => {
    Api.closeWindow();
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
            isActive={location.pathname === "/" && isLibraryVisible && isSmall}
            isSmall={isSmall}
          >
            <FontAwesomeIcon icon="bars" />
          </LibraryButton>

          <SearchButton
            onClick={toggleSearch}
            ref={searchButtonRef}
            isMacOs={isMacOs}
            isActive={location.pathname.startsWith("/search")}
          >
            <FontAwesomeIcon icon="search" />
          </SearchButton>

          <SettingsButton
            onClick={toggleSettings}
            ref={settingsButtonRef}
            isMacOs={isMacOs}
            isActive={location.pathname.startsWith("/settings")}
          >
            <FontAwesomeIcon icon="cog" />
          </SettingsButton>
        </div>
        <Title>{locationToTitleMap[location.pathname]}</Title>
        <ActionsContainer isElectron={isElectron}>
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
        </ActionsContainer>
      </Container>
    </>
  );
};

export default connect(
  (state) => ({
    musicLibraryPath: state.settings.musicLibraryPath,
    currentLocation: state.settings.currentLocation,
  }),
  (dispatch) => ({ dispatch })
)(Titlebar);
