import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";
import { useKeyPress } from "../hooks";
import { KEYS, isCtrlDown } from "../util";
import Library from "./Library";
import Player from "./Player";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 12px;
  width: 100%;
  height: 30px;
  z-index: 10;
  position: absolute;
`;

const Button = styled.button`
  font-size: 1.4rem;
  margin-right: 12px;
  outline: none;
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
    const handleClick = e => {
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

  const goToSearchByKeyEvent = event => {
    if (!isCtrlDown(event)) return;
    history.push("/search");
    setIsLibraryVisible(false);
  };
  useKeyPress(KEYS.F, goToSearchByKeyEvent);

  const handleToolbarClick = event => {
    if (event.target.id === "Toolbar") {
      history.push("/");
    }
  };

  const toggleLibrary = event => {
    libraryButtonRef.current.blur();
    if (location.pathname !== "/") {
      history.push("/");
      setIsLibraryVisible(true);
      return;
    }
    setIsLibraryVisible(!isLibraryVisible);
    event.stopPropagation();
  };

  const goToSettings = event => {
    settingsButtonRef.current.blur();
    history.push("/settings");
    event.stopPropagation();
  };
  const goToSearch = event => {
    searchButtonRef.current.blur();
    history.push("/search");
    event.stopPropagation();
  };

  return (
    <ToolbarContainer id="Toolbar" onClick={handleToolbarClick}>
      <Button onClick={toggleLibrary} ref={libraryButtonRef}>
        <FontAwesomeIcon icon="bars" />
      </Button>
      <Library ref={libraryRef} isVisible={isLibraryVisible} />

      <Player />

      <Button onClick={goToSettings} ref={settingsButtonRef}>
        <FontAwesomeIcon icon="cog" />
      </Button>

      <Button onClick={goToSearch} ref={searchButtonRef}>
        <FontAwesomeIcon icon="search" />
      </Button>
    </ToolbarContainer>
  );
};

export default withRouter(Toolbar);
