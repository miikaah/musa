import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useKeyPress } from "../../hooks";
import { isCtrlDown, dispatchToast } from "../../util";
import { KEYS, isElectron } from "../../config";
import Library, { LibraryMode } from "../Library";
import { breakpoints } from "../../breakpoints";
import * as Api from "../../apiClient";
import { SettingsState } from "../../reducers/settings.reducer";
import { PlayerState } from "../../reducers/player.reducer";
import { TranslateFn } from "../../i18n";

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

  &:hover {
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

  &:hover {
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

  &:hover {
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

const buttonCss2 = css<{ isActive?: boolean }>`
  font-size: 1.2rem;
  outline: none;
  -webkit-app-region: no-drag;
  width: 48px;
  height: 36px;
  cursor: default;
  color: ${({ isActive }) => (isActive ? "#fff" : "inherit")};
  background: ${({ isActive }) => (isActive ? "#9b9b9b" : "transparent")};

  &:hover {
    color: #fff;
    background: #9b9b9b;
  }
`;

const LibraryButton = styled.button<{ isActive?: boolean; isSmall: boolean }>`
  ${buttonCss2}

  background: ${({ isActive, isSmall }) =>
    isActive && isSmall ? "#9b9b9b" : "transparent"};
`;

const SearchButton = styled.button<{ isActive?: boolean }>`
  ${buttonCss2}
`;

const SettingsButton = styled.button<{ isActive?: boolean }>`
  ${buttonCss2}
`;

const ShareButton = styled.button<{ isActive?: boolean }>`
  ${buttonCss2}
`;

const Title = styled.div`
  font-size: 0.9rem;
`;

const ActionsContainer = styled.div<{ isElectron: boolean }>`
  visibility: ${({ isElectron }) => (isElectron ? "visible" : "hidden")};
`;

const locationToTitleMap: (t: TranslateFn) => Record<string, string> = (
  t: TranslateFn,
) => ({
  "/": "Musa",
  "/search": t("titlebar.location.search"),
  "/search/": t("titlebar.location.search"),
  "/settings": t("titlebar.location.settings"),
  "/settings/": t("titlebar.location.settings"),
});

const getLibraryMode = (libraryMode: string): LibraryMode => {
  switch (libraryMode) {
    case "none": {
      return "none";
    }
    case "library": {
      return "library";
    }
    case "visualizer": {
      return "visualizer";
    }
    default: {
      throw new Error("Invalid libraryMode");
    }
  }
};

type TitleBarProps = {
  playlist: PlayerState["items"];
  t: any;
};

const Titlebar = ({ playlist, t }: TitleBarProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoints.md);
  const [isSmall, setIsSmall] = useState(
    window.innerWidth < breakpoints.lg && window.innerWidth >= breakpoints.md,
  );
  const [libraryMode, setLibraryMode] = useState<
    "none" | "library" | "visualizer"
  >("none");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
  }, []);

  const libraryRef = useRef<HTMLDivElement | null>(null);
  const libraryButtonRef = useRef<HTMLButtonElement | null>(null);
  const visualizerButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Close library when clicking outside it like the playlist
    const handleClick = (e: MouseEvent) => {
      if (
        libraryButtonRef.current &&
        libraryButtonRef.current.contains(e.target as Node)
      ) {
        return;
      }

      if (libraryRef.current && libraryRef.current.contains(e.target as Node)) {
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

  const goToSearchByKeyEvent = (event: KeyboardEvent) => {
    if (!isCtrlDown(event) || !event.shiftKey) {
      return;
    }

    if (location.pathname === "/search") {
      navigate("/");
      return;
    }

    navigate("/search");
  };
  useKeyPress(KEYS.f, goToSearchByKeyEvent);
  useKeyPress(KEYS.F, goToSearchByKeyEvent);

  const toggleLibrary = (event: React.MouseEvent) => {
    if (!libraryButtonRef.current) {
      return;
    }

    libraryButtonRef.current.blur();

    if (location.pathname !== "/") {
      navigate("/");
      setLibraryMode("library");
      return;
    }

    setLibraryMode(libraryMode === "library" ? "none" : "library");
    event.stopPropagation();
  };

  const toggleVisualizer = (event: React.MouseEvent) => {
    if (!visualizerButtonRef.current) {
      return;
    }

    visualizerButtonRef.current.blur();

    if (location.pathname !== "/") {
      navigate("/");
      setLibraryMode("visualizer");
      return;
    }

    setLibraryMode(libraryMode === "visualizer" ? "none" : "visualizer");
    event.stopPropagation();
  };

  const toggleSearch = (event: React.MouseEvent) => {
    if (!searchButtonRef.current) {
      return;
    }

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

  // NOTE: The modern way of doing this with Navigator
  //       doesn't work with http only https. It does work
  //       with http in localhost though.
  const copyToClipboard = (text: string) => {
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

  const createPlaylist = (event: React.MouseEvent) => {
    if (!shareButtonRef.current) {
      return;
    }

    shareButtonRef.current.blur();

    if (Array.isArray(playlist) && playlist.length) {
      const pathIds = playlist.map(({ id }) => id);

      Api.insertPlaylist(pathIds).then((playlist) => {
        const text = `${window.location.href}?pl=${playlist.id}`;

        copyToClipboard(text);

        dispatchToast(
          t("toast.createPlaylist")(text),
          "share-playlist",
          dispatch,
        );
      });
    }

    event.stopPropagation();
  };

  const toggleSettings = (event: React.MouseEvent) => {
    if (!settingsButtonRef.current) {
      return;
    }

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
      <Library ref={libraryRef} libraryMode={getLibraryMode(libraryMode)} />
      <Container data-testid="TitlebarContainer">
        <div>
          <LibraryButton
            onClick={toggleLibrary}
            ref={libraryButtonRef}
            isActive={
              location.pathname === "/" && libraryMode === "library" && isSmall
            }
            isSmall={isSmall}
            data-testid="TitlebarLibraryButton"
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
              data-testid="TitlebarVisualizerButton"
            >
              <FontAwesomeIcon icon="chart-column" />
            </LibraryButton>
          )}

          <SearchButton
            onClick={toggleSearch}
            ref={searchButtonRef}
            isActive={location.pathname.startsWith("/search")}
            data-testid="TitlebarSearchButton"
          >
            <FontAwesomeIcon icon="search" />
          </SearchButton>

          {!isElectron && (
            <ShareButton
              onClick={createPlaylist}
              ref={shareButtonRef}
              data-testid="TitlebarShareButton"
            >
              <FontAwesomeIcon icon="share" />
            </ShareButton>
          )}

          <SettingsButton
            onClick={toggleSettings}
            ref={settingsButtonRef}
            isActive={location.pathname.startsWith("/settings")}
            data-testid="TitlebarSettingsButton"
          >
            <FontAwesomeIcon icon="cog" />
          </SettingsButton>
        </div>

        {!isMobile && (
          <Title data-testid="TitlebarLocation">
            {locationToTitleMap(t)[location.pathname]}
          </Title>
        )}

        <ActionsContainer isElectron={isElectron}>
          <MinButton onClick={minimize} data-testid="TitlebarMinimizeButton">
            <div />
          </MinButton>
          <MaxButton onClick={maxOrUnMax} data-testid="TitlebarMaximizeButton">
            <div />
          </MaxButton>
          <CloseButton onClick={close} data-testid="TitlebarCloseButton">
            <div />
            <div />
          </CloseButton>
        </ActionsContainer>
      </Container>
    </>
  );
};

export default connect(
  (state: { settings: SettingsState; player: PlayerState }) => ({
    t: state.settings.t,
    playlist: state.player.items,
  }),
  (dispatch) => ({ dispatch }),
)(Titlebar);
