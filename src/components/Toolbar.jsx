import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components/macro";
import { useKeyPress } from "../hooks";
import { KEYS, isCtrlDown } from "../util";
import Library from "components/Library";
import Player from "components/Player";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  width: 100%;
  min-height: var(--toolbar-height);
  z-index: 10;
  position: absolute;
  background: var(--color-bg);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 16px;
`;

const buttonCss = css`
  font-size: 1.4rem;
  outline: none;
`;

const LibraryButton = styled.button`
  ${buttonCss}
`;

const RightContainer = styled.div`
  min-width: 57px;
`;

const SearchButton = styled.button`
  ${buttonCss}
  margin-right: 12px;
`;

const SettingsButton = styled.button`
  ${buttonCss}
`;

const Toolbar = ({ location, history }) => {
  const [isLibraryVisible, setIsLibraryVisible] = useState(
    location.pathname === "/"
  );

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

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const goToSearchByKeyEvent = (event) => {
    if (!isCtrlDown(event)) return;
    history.push("/search");
    setIsLibraryVisible(false);
  };
  useKeyPress(KEYS.F, goToSearchByKeyEvent);

  const handleToolbarClick = (event) => {
    if (event.target.id === "Toolbar") {
      history.push("/");
    }
  };

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

  return (
    <>
      <Library ref={libraryRef} isVisible={isLibraryVisible} />
      <ToolbarContainer id="Toolbar" onClick={handleToolbarClick}>
        <LibraryButton onClick={toggleLibrary} ref={libraryButtonRef}>
          <FontAwesomeIcon icon="bars" />
        </LibraryButton>

        <Player />

        <RightContainer>
          <SearchButton onClick={toggleSearch} ref={searchButtonRef}>
            <FontAwesomeIcon icon="search" />
          </SearchButton>

          <SettingsButton onClick={toggleSettings} ref={settingsButtonRef}>
            <FontAwesomeIcon icon="cog" />
          </SettingsButton>
        </RightContainer>
      </ToolbarContainer>
    </>
  );
};

export default withRouter(Toolbar);
