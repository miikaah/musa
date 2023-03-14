import React, { useState, useEffect } from "react";
import LibraryList from "./LibraryListV2";
import Visualizer from "./Visualizer";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { listOverflow } from "../common.styles";
import { breakpoint } from "../breakpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  ${({ isLibrary, filter }) =>
    isLibrary
      ? filter
        ? `
        overflow: auto; // Stop scrollbar from flickering during filtering

        ::-webkit-scrollbar {
          width: 0;
        }`
        : "overflow: auto;"
      : "overflow: hidden;"}
`;

const FilterContainer = styled.div`
  position: fixed;
  top: 51px;
  left: 12px;
  z-index: 2;

  > svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    color: var(--color-black);

    :hover {
      cursor: pointer;
    }
  }
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

const Library = ({
  dispatch,
  forwardRef,
  libraryMode,
  listingWithLabels,
  albums,
}) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint.lg);
  const [filter, setFilter] = useState("");
  const [filteredListing, setFilteredListing] = useState({});

  useEffect(() => {
    if (!filter) {
      setFilteredListing({});

      return;
    }

    const firstChar = filter.substring(0, 1).toUpperCase();
    const strictArtists = (listingWithLabels[firstChar] || []).filter((a) =>
      a.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (strictArtists.length < 1) {
      setFilteredListing({});

      return;
    }

    setFilteredListing({
      [firstChar]: strictArtists,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, listingWithLabels]);

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

  const clearArtistFilter = () => {
    const filterEl = document.getElementById("artistFilter");
    filterEl.value = "";
    setFilter("");
  };

  return (
    <>
      <Container
        ref={forwardRef}
        isSmall={isSmall}
        isVisible={libraryMode === "library"}
        isLibrary={libraryMode === "library"}
        filter={filter}
      >
        <>
          <FilterContainer>
            <input
              id="artistFilter"
              autoFocus
              value={filter}
              placeholder="Filter by artist"
              onChange={(e) => setFilter(e.target.value)}
            />
            <FontAwesomeIcon onClick={clearArtistFilter} icon="xmark" />
          </FilterContainer>
          {listingWithLabels &&
            Object.entries(
              Object.keys(filteredListing).length && filter
                ? filteredListing
                : listingWithLabels
            ).map(([key, artist]) => (
              <div key={key}>
                <Label>
                  <span>{key}</span>
                </Label>
                {artist.map((item, index) => (
                  <LibraryList key={item.id} item={item} isArtist />
                ))}
              </div>
            ))}
        </>
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
