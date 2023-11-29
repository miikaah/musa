import { ArtistObject, ArtistWithEnrichedAlbums } from "@miikaah/musa-core";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch } from "redux";
import styled, { css } from "styled-components";
import { LibraryState } from "../reducers/library.reducer";
import {
  setQuery,
  setFilter,
  setSearchResults,
  setIsSearchRandom,
  setIsSearchTermLocked,
  clearSearch,
  updateScrollPosition,
  SearchState,
  ScrollPos,
} from "../reducers/search.reducer";
import { SettingsState } from "../reducers/settings.reducer";
import { useDebounce } from "../hooks";
import Song from "../components/Song";
import Album from "../components/Album";
import Artist from "../components/Artist";
import Button from "../components/Button";
import Select from "../components/Select";
import { isElectron } from "../config";
import Api from "../apiClient";
import { ArrowDown as ArrowDownStyled } from "../common.styles";
import { TranslateFn } from "../i18n";

const Container = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  margin-top: var(--titlebar-height);

  input {
    width: 100%;

    &::placeholder {
      color: #919191;
      font-size: 0.9em;
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    position: static;
    margin: 60px auto;
    max-width: 96vw;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

const ContainerWrapper = styled.div`
  width: auto;
  margin: 0 auto;
  overflow: auto;
  padding: 20px;

  @media (min-width: 960px) {
    max-width: 960px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

const Wrapper = styled.div`
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;

  > div:first-child {
    min-width: 150px;
    max-width: 150px;
  }

  > div:not(:first-child) {
    min-width: 374.81px;
    max-width: 374.81px;
  }

  > div:not(:last-child) {
    margin-right: 10px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;
    padding-bottom: 60px;

    > div {
      min-width: unset !important;
      max-width: unset !important;
    }

    > div:first-of-type {
      > div:first-of-type {
        min-height: 8vh;
        max-height: 8vh;
      }
    }

    > div:not(:last-child) {
      margin-right: 0;
    }
  }
`;

const SearchBlock = styled.div`
  margin-bottom: 20px;
  color: #000;

  h5 {
    color: var(--color-typography);
  }
`;

const SearchBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${isElectron ? 730 : 640}px;
  max-height: ${isElectron ? 730 : 640}px;
  background: #fff;
  padding: 10px 0 0 10px;
  overflow-y: scroll;

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-height: 20vh;
    max-height: 20vh;
  }
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  > div:nth-of-type(1) {
    min-width: 420px;
    margin-right: 10px;
    position: relative;
    flex-grow: 1;
  }

  > button:first-of-type {
    margin-right: 10px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;

    > div:nth-of-type(1) {
      margin-right: 0;
      min-width: unset;
    }

    > button:first-of-type {
      margin-right: 0;
    }
  }
`;

const SearchInputContainer = styled.div<{ query: string }>`
  > input {
    padding-right: 80px;
  }

  > svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;

    path {
      fill: ${({ query }) => (query ? "#000" : "#ccc")};
    }

    &:hover {
      cursor: pointer;
    }
  }
`;

const ArrowDown = styled(ArrowDownStyled)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 50px;
  border-top-color: #000;
`;

const buttonStyles = css`
  max-width: 120px;
  max-height: 40px;
  justify-self: end;
  align-self: center;

  ${({ theme }) => theme.breakpoints.down("md")} {
    max-width: unset;
    align-self: flex-start;
  }
`;

const RandomButton = styled(Button)`
  ${buttonStyles}
`;

const ClearButton = styled(Button)`
  ${buttonStyles}
`;

type SearchProps = {
  query: string;
  artists: SearchState["searchArtists"];
  albums: SearchState["searchAlbums"];
  audios: SearchState["searchAudios"];
  isSearchRandom: boolean;
  isSearchTermLocked: boolean;
  scrollPos: ScrollPos;
  listingWithLabels: ArtistObject;
  t: TranslateFn;
  dispatch: Dispatch;
};

const Search = ({
  query,
  artists,
  albums,
  audios,
  isSearchRandom,
  isSearchTermLocked,
  scrollPos,
  listingWithLabels,
  t,
  dispatch,
}: SearchProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [showGenreSelect, setShowGenreSelect] = useState(false);
  const queryToBackend = useDebounce<string>(query, 300);
  const artistListRef = useRef<HTMLDivElement & { scrollTop: number }>(null);
  const albumListRef = useRef<HTMLDivElement & { scrollTop: number }>(null);
  const audioListRef = useRef<HTMLDivElement & { scrollTop: number }>(null);

  useEffect(() => {
    if (queryToBackend && !isSearchTermLocked) {
      Api.find(queryToBackend).then((result) => {
        dispatch(
          setSearchResults({
            artists: result.artists,
            albums: result.albums,
            audios: result.audios,
          }),
        );
        dispatch(setFilter(""));
      });

      dispatch(setIsSearchRandom(false));
      dispatch(updateScrollPosition({ artists: 0, albums: 0, audios: 0 }));

      if (artistListRef.current) {
        artistListRef.current.scrollTop = 0;
      }
      if (albumListRef.current) {
        albumListRef.current.scrollTop = 0;
      }
      if (audioListRef.current) {
        audioListRef.current.scrollTop = 0;
      }
    } else if (!isSearchRandom && !isFetching && query.length < 1) {
      dispatch(
        setSearchResults({
          artists: [],
          albums: [],
          audios: [],
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToBackend]);

  useEffect(() => {
    if (artistListRef.current) {
      artistListRef.current.scrollTop = scrollPos.artists;
    }
    if (albumListRef.current) {
      albumListRef.current.scrollTop = scrollPos.albums;
    }
    if (audioListRef.current) {
      audioListRef.current.scrollTop = scrollPos.audios;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Api.getAllGenres().then(setGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findRandom = () => {
    setIsFetching(true);
    dispatch(setFilter(""));

    if (isSearchTermLocked) {
      Api.findRandomWithLockedSearchTerm(query).then((result) => {
        dispatch(setIsSearchRandom(true));
        dispatch(setSearchResults(result));
        setIsFetching(false);
      });
    } else {
      Api.findRandom().then((result) => {
        dispatch(setQuery(""));
        dispatch(setIsSearchRandom(true));
        dispatch(setSearchResults(result));
        setIsFetching(false);
      });
    }
  };

  const artistToRender = artists.length
    ? artists
    : (Object.values(listingWithLabels).flat(
        Infinity,
      ) as unknown as ArtistWithEnrichedAlbums[]); // Cast because the subset fits

  // NOTE: Need to keep track of this because at least on Windows
  //       when going from long scrolled list to a short one that can not be
  //       scrolled, when React re-renders it scrolls the list elements to top
  //       before it replaces the elements inside of them causing an annoying
  //       flash of different albums covers and titles
  const isFetchingRandomFirstTime = isFetching && !isSearchRandom;

  const updateQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
    dispatch(setIsSearchTermLocked(false));
  };

  const toggleSearchLock = () => {
    if (!query) {
      return;
    }
    dispatch(setIsSearchTermLocked(!isSearchTermLocked));
  };

  const clear = () => {
    dispatch(setIsSearchTermLocked(false));
    dispatch(clearSearch());
  };

  const setGenre = (event: React.MouseEvent<HTMLDivElement>) => {
    dispatch(setIsSearchTermLocked(false));
    dispatch(setQuery(`genre:${(event.target as HTMLElement).textContent}`));
    setShowGenreSelect(false);
  };

  const toggleGenreSelect = () => {
    setShowGenreSelect(!showGenreSelect);
  };

  return (
    <Container>
      <ContainerWrapper>
        <InputContainer>
          <SearchInputContainer query={query}>
            <input
              value={query}
              placeholder={t("search.input.placeholder")}
              onChange={updateQuery}
            />
            <ArrowDown onClick={toggleGenreSelect} />
            <Select
              showSelect={showGenreSelect}
              top={45}
              maxWidth={420}
              dock="right"
            >
              {genres.map((genre, i) => (
                <div key={i} title={genre} onClick={setGenre}>
                  {genre}
                </div>
              ))}
            </Select>
            {isSearchTermLocked ? (
              <FontAwesomeIcon onClick={toggleSearchLock} icon="lock" />
            ) : (
              <FontAwesomeIcon onClick={toggleSearchLock} icon="lock-open" />
            )}
          </SearchInputContainer>

          <RandomButton
            isPrimary
            isSmall
            onClick={findRandom}
            dataTestId="SearchRandomButton"
          >
            {t("search.action.random")}
          </RandomButton>
          <ClearButton
            isSecondary
            isSmall
            onClick={clear}
            dataTestId="SearchClearButton"
          >
            {t("search.action.clear")}
          </ClearButton>
        </InputContainer>
        <Wrapper>
          <SearchBlock>
            <h5>{`${t("search.results.artists")} (${
              artistToRender.length
            })`}</h5>
            <SearchBlockWrapper
              ref={artistListRef}
              onScroll={(event: React.UIEvent) => {
                dispatch(
                  updateScrollPosition({
                    artists: (event.target as HTMLElement).scrollTop,
                  }),
                );
              }}
            >
              {React.useMemo(() => {
                return artistToRender.map((a, i) => (
                  <Artist key={i} item={a} />
                ));
              }, [artistToRender])}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>{`${t("search.results.albums")} (${albums.length})`}</h5>
            <SearchBlockWrapper
              ref={albumListRef}
              onScroll={(event: React.UIEvent) => {
                dispatch(
                  updateScrollPosition({
                    albums: (event.target as HTMLElement).scrollTop,
                  }),
                );
              }}
              data-testid="SearchAlbums"
            >
              {React.useMemo(
                () =>
                  isFetchingRandomFirstTime ? (
                    <div>...</div>
                  ) : (
                    albums.map((a, i) => {
                      return <Album key={i} item={a} />;
                    })
                  ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [albums, isFetchingRandomFirstTime],
              )}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>{`${t("search.results.songs")} (${audios.length})`}</h5>
            <SearchBlockWrapper
              ref={audioListRef}
              onScroll={(event: React.UIEvent) => {
                dispatch(
                  updateScrollPosition({
                    audios: (event.target as HTMLElement).scrollTop,
                  }),
                );
              }}
              data-testid="SearchAudios"
            >
              {React.useMemo(
                () =>
                  isFetchingRandomFirstTime ? (
                    <div>...</div>
                  ) : (
                    audios.map((a, i) => {
                      return <Song key={i} item={a} />;
                    })
                  ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [audios, isFetchingRandomFirstTime],
              )}
            </SearchBlockWrapper>
          </SearchBlock>
        </Wrapper>
      </ContainerWrapper>
    </Container>
  );
};

export default connect(
  (state: {
    search: SearchState;
    library: LibraryState;
    settings: SettingsState;
  }) => ({
    query: state.search.query,
    artists: state.search.searchArtists,
    albums: state.search.searchAlbums,
    audios: state.search.searchAudios,
    isSearchRandom: state.search.isRandom,
    isSearchTermLocked: state.search.isSearchTermLocked,
    scrollPos: state.search.scrollPos,
    listingWithLabels: state.library.listingWithLabels,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(Search);
