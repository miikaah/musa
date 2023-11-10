import { ArtistObject } from "@miikaah/musa-core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { listOverflow } from "../../common.styles";
import { breakpoints } from "../../breakpoints";
import { LibraryState } from "../../reducers/library.reducer";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import LibraryList from "./LibraryList";
import Visualizer from "../Visualizer";

const Container = styled.div<{
  isSmall: boolean;
  isVisible: boolean;
  isLibrary: boolean;
  filter?: string;
}>`
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

        &::-webkit-scrollbar {
          width: 0;
        }`
        : "overflow: auto;"
      : "overflow: hidden;"}

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: 100vw;
    max-width: 100vw;
    min-height: 50vh;
    max-height: 50vh;
  }
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

    &:hover {
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

export type LibraryMode = "none" | "library" | "visualizer";

type LibraryProps = {
  forwardRef?: React.ForwardedRef<HTMLDivElement>;
  libraryMode: LibraryMode;
  listingWithLabels: LibraryState["listingWithLabels"];
  t: TranslateFn;
};

const Library = ({
  forwardRef,
  libraryMode,
  listingWithLabels,
  t,
}: LibraryProps) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoints.lg);
  const [filter, setFilter] = useState("");
  const [filteredListing, setFilteredListing] = useState({});

  useEffect(() => {
    if (!filter) {
      setFilteredListing({});

      return;
    }

    const firstChar = filter.substring(0, 1).toUpperCase();
    const strictArtists = (listingWithLabels[firstChar] || []).filter((a) =>
      a.name.toLowerCase().includes(filter.toLowerCase()),
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
      setIsSmall(window.innerWidth < breakpoints.lg);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearArtistFilter = () => {
    const filterEl = document.getElementById(
      "artistFilter",
    ) as HTMLInputElement;
    filterEl.value = "";
    setFilter("");
  };

  return (
    <>
      <Container
        id="LibraryContainer"
        ref={forwardRef}
        isSmall={isSmall}
        isVisible={libraryMode === "library"}
        isLibrary={libraryMode === "library"}
        filter={filter}
        data-testid="LibraryLibraryContainer"
      >
        <>
          <FilterContainer>
            <input
              id="artistFilter"
              autoFocus
              value={filter}
              placeholder={t("library.filter.placeholder")}
              onChange={(e) => setFilter(e.target.value)}
            />
            <FontAwesomeIcon
              onClick={clearArtistFilter}
              icon="xmark"
              data-testid="LibraryFilterClearButton"
            />
          </FilterContainer>
          {listingWithLabels &&
            Object.entries(
              (Object.keys(filteredListing).length && filter
                ? filteredListing
                : listingWithLabels) as ArtistObject,
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
        data-testid="LibraryVisualizerContainer"
      >
        <Visualizer isVisible={libraryMode === "visualizer"} />
      </Container>
    </>
  );
};

const ConnectedLibrary = connect(
  (state: { library: LibraryState; settings: SettingsState }) => ({
    listingWithLabels: state.library.listingWithLabels,
    t: state.settings.t,
  }),
)(Library);

export default React.forwardRef(
  (
    props: { libraryMode: LibraryMode },
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => <ConnectedLibrary {...props} forwardRef={ref} />,
);
