import React, { useState, useEffect } from "react";
import LibraryList from "./LibraryListV2";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { listOverflow } from "../common.styles";
import { breakpoint } from "../breakpoints";

const LibraryContainer = styled.div`
  text-align: left;
  border: 0 solid var(--color-secondary-highlight);
  border-left-width: 4px;
  border-right-width: 1px;
  background-color: var(--color-bg);
  box-shadow: ${({ isSmall }) =>
    isSmall && "25px 10px 31px -17px rgba(10, 10, 10, 0.75)"};
  position: absolute;
  min-width: 400px;
  z-index: 1;
  width: ${({ isSmall }) => (isSmall ? "400px" : "var(--library-width)")};
  height: 100vh;
  margin-top: var(--titlebar-height);
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  padding-bottom: var(--toolbar-height);
  ${listOverflow}
`;

const LibraryLabel = styled.div`
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

const Library = ({ dispatch, forwardRef, isVisible, listingWithLabels }) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint.lg);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmall(window.innerWidth < breakpoint.lg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LibraryContainer ref={forwardRef} isVisible={isVisible} isSmall={isSmall}>
      {listingWithLabels &&
        Object.entries(listingWithLabels).map(([key, artist]) => (
          <div key={key}>
            <LibraryLabel>
              <span>{key}</span>
            </LibraryLabel>
            {artist.map((item, index) => (
              <LibraryList key={item.id} item={item} isArtist />
            ))}
          </div>
        ))}
    </LibraryContainer>
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
