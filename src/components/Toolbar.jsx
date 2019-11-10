import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components/macro";
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

  const handleToolbarClick = event => {
    if (event.target.id === "Toolbar") {
      history.push("/");
    }
  };

  const toggleLibrary = event => {
    if (location.pathname !== "/") {
      history.push("/");
      setIsLibraryVisible(true);
      return;
    }
    setIsLibraryVisible(!isLibraryVisible);
    event.stopPropagation();
  };

  const goTo = (path, event) => {
    history.push(path);
    event.stopPropagation();
  };
  const goToSettings = event => goTo("/settings", event);
  const goToSearch = event => goTo("/search", event);

  return (
    <ToolbarContainer id="Toolbar" onClick={handleToolbarClick}>
      <Button onClick={toggleLibrary} ref={libraryButtonRef}>
        <FontAwesomeIcon icon="bars" />
      </Button>
      <Library ref={libraryRef} isVisible={isLibraryVisible} />

      <Player />

      <Button onClick={goToSettings}>
        <FontAwesomeIcon icon="cog" />
      </Button>

      <Button onClick={goToSearch}>
        <FontAwesomeIcon icon="search" />
      </Button>
    </ToolbarContainer>
  );
};

export default withRouter(Toolbar);
