import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPress } from "../hooks";
import { KEYS, isCtrlDown, dispatchToast } from "../util";
import Library from "components/LibraryV2";
import { breakpoints } from "../breakpoints";
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
  cursor: default;
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
  cursor: default;
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

const ShareButton = styled.button`
  ${buttonCss2}
`;

const Title = styled.div`
  font-size: 0.9rem;
`;

const ActionsContainer = styled.div`
  visibility: ${({ isElectron }) => (isElectron ? "visible" : "hidden")};
`;

const ProfileName = styled.div`
  font-size: var(--font-size-xs);
  margin-left: 4px;

  :hover {
    cursor: default;
  }
`;

const locationToTitleMap = {
  "/": "Musa",
  "/search": "Search",
  "/search/": "Search",
  "/settings": "Settings",
  "/settings/": "Settings",
};

const Titlebar = ({ currentProfile, playlist, dispatch }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoints.md);
  const [isSmall, setIsSmall] = useState(
    window.innerWidth < breakpoints.lg && window.innerWidth >= breakpoints.md
  );
  const location = useLocation();
  const navigate = useNavigate();
  // "none" | "library" | "visualizer"
  const [libraryMode, setLibraryMode] = useState("none");

  useEffect(() => {
    const onResize = () => {
      if (
        window.innerWidth < breakpoints.lg &&
        window.innerWidth >= breakpoints.md
      ) {
        setIsSmall(true);
        setIsMobile(false);
      } else if (window.innerWidth < breakpoints.md) {
        setIsSmall(false);
        setIsMobile(true);
      } else {
        setIsSmall(false);
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const libraryRef = useRef();
  const libraryButtonRef = useRef();
  const visualizerButtonRef = useRef();
  const settingsButtonRef = useRef();
  const searchButtonRef = useRef();
  const shareButtonRef = useRef();

  useEffect(() => {
    // Close library when clicking outside it like the playlist
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

      if (libraryMode === "visualizer") {
        return;
      }

      if (location.pathname === "/") {
        setLibraryMode("none");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isSmall, location, libraryMode]);

  const goToSearchByKeyEvent = (event) => {
    if (!isCtrlDown(event) || !event.shiftKey) {
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
      setLibraryMode("library");
      return;
    }

    setLibraryMode(libraryMode === "library" ? "none" : "library");
    event.stopPropagation();
  };

  const toggleVisualizer = (event) => {
    visualizerButtonRef.current.blur();

    if (location.pathname !== "/") {
      navigate("/");
      setLibraryMode("visualizer");
      return;
    }

    setLibraryMode(libraryMode === "visualizer" ? "none" : "visualizer");
    event.stopPropagation();
  };

  const toggleSettings = (event) => {
    settingsButtonRef.current.blur();

    if (location.pathname.startsWith("/settings")) {
      navigate("/");
    } else {
      navigate("/settings");

      if (window.innerWidth < breakpoints.md) {
        setLibraryMode("none");
      }
    }

    event.stopPropagation();
  };

  // NOTE: The modern way of doing this with Navigator
  //       doesn't work with http only https. It does work
  //       with http in localhost though.
  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Set the position to be off-screen
    textarea.style.position = "fixed";
    textarea.style.top = "100%";

    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");

    document.body.removeChild(textarea);
  };

  const createPlaylist = (event) => {
    shareButtonRef.current.blur();

    if (Array.isArray(playlist) && playlist.length) {
      const pathIds = playlist.map(({ id }) => id);

      Api.insertPlaylist(pathIds).then((playlist) => {
        const text = `${window.location.href}?pl=${playlist.id}`;

        copyToClipboard(text);

        dispatchToast(
          `Copied ${text} to clipboard`,
          "share-playlist",
          dispatch
        );
      });
    }

    event.stopPropagation();
  };

  const toggleSearch = (event) => {
    searchButtonRef.current.blur();

    if (location.pathname.startsWith("/search")) {
      navigate("/");
    } else {
      navigate("/search");

      if (window.innerWidth < breakpoints.md) {
        setLibraryMode("none");
      }
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
      <Library ref={libraryRef} libraryMode={libraryMode} />
      <Container>
        <div>
          <LibraryButton
            onClick={toggleLibrary}
            ref={libraryButtonRef}
            isActive={
              location.pathname === "/" && libraryMode === "library" && isSmall
            }
            isSmall={isSmall}
          >
            <FontAwesomeIcon icon="bars" />
          </LibraryButton>

          {!isMobile && (
            <LibraryButton
              onClick={toggleVisualizer}
              ref={visualizerButtonRef}
              isActive={
                location.pathname === "/" &&
                libraryMode === "visualizer" &&
                isSmall
              }
              isSmall={isSmall}
            >
              <FontAwesomeIcon icon="chart-column" />
            </LibraryButton>
          )}

          <SearchButton
            onClick={toggleSearch}
            ref={searchButtonRef}
            isActive={location.pathname.startsWith("/search")}
          >
            <FontAwesomeIcon icon="search" />
          </SearchButton>

          {!isElectron && (
            <ShareButton onClick={createPlaylist} ref={shareButtonRef}>
              <FontAwesomeIcon icon="share" />
            </ShareButton>
          )}

          <SettingsButton
            onClick={toggleSettings}
            ref={settingsButtonRef}
            isActive={location.pathname.startsWith("/settings")}
          >
            <FontAwesomeIcon icon="cog" />
          </SettingsButton>

          {!isMobile && currentProfile && (
            <button>
              <ProfileName>{currentProfile.split("@")[0]}</ProfileName>
            </button>
          )}
        </div>

        {!isMobile && <Title>{locationToTitleMap[location.pathname]}</Title>}

        <ActionsContainer isElectron={isElectron}>
          <MinButton onClick={minimize}>
            <div />
          </MinButton>
          <MaxButton onClick={maxOrUnMax}>
            <div />
          </MaxButton>
          <CloseButton onClick={close}>
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
    currentProfile: state.profile.currentProfile,
    playlist: state.player.items,
  }),
  (dispatch) => ({ dispatch })
)(Titlebar);
