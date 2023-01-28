import React, { useState, useEffect } from "react";
import LibraryList from "./LibraryListV2";
import Visualizer from "./Visualizer";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { listOverflow } from "../common.styles";
import { breakpoint } from "../breakpoints";

const Container = styled.div`
  text-align: left;
  border: 0 solid var(--color-secondary-highlight);
  border-left-width: 4px;
  border-right-width: 1px;
  background-color: var(--color-bg);
  box-shadow: ${({ isSmall }) =>
    isSmall && "25px 10px 31px -17px rgba(10, 10, 10, 0.75)"};
  position: absolute;
  z-index: 1;
  min-width: var(--library-width);
  max-width: var(--library-width);
  height: 100vh;
  margin-top: var(--titlebar-height);
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  padding-bottom: var(--toolbar-height);
  ${listOverflow}
  overflow: ${({ isLibrary }) => (isLibrary ? "auto" : "hidden")};
`;

const Label = styled.div`
  text-align: right;
  padding: 20px;

  span {
    color: var(--color-typography-primary);
    background-color: var(--color-primary-highlight);
    padding: 5px 10px;
    font-size: 40px;
    border-radius: 3px;
  }
`;

const Library = ({ dispatch, forwardRef, libraryMode, listingWithLabels }) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint.lg);

  useEffect(() => {
    const onResize = () => {
      setIsSmall(window.innerWidth < breakpoint.lg);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container
        ref={forwardRef}
        isSmall={isSmall}
        isVisible={libraryMode === "library"}
        isLibrary={libraryMode === "library"}
      >
        {listingWithLabels &&
          Object.entries(listingWithLabels).map(([key, artist]) => (
            <div key={key}>
              <Label>
                <span>{key}</span>
              </Label>
              {artist.map((item, index) => (
                <LibraryList key={item.id} item={item} isArtist />
              ))}
            </div>
          ))}
      </Container>
      <Container
        isSmall={isSmall}
        isVisible={libraryMode === "visualizer"}
        isLibrary={libraryMode === "library"}
      >
        <Visualizer isVisible={libraryMode === "visualizer"} />
      </Container>
    </>
  );
};

const ConnectedLibrary = connect(
  (state) => ({
    listingWithLabels: state.library.listingWithLabels,
  }),
  (dispatch) => ({ dispatch })
)(Library);

export default React.forwardRef((props, ref) => (
  <ConnectedLibrary {...props} forwardRef={ref} />
));
