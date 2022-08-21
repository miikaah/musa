import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setQuery,
  setFilter,
  setSearchResults,
  setIsSearchRandom,
  setIsSearchTermLocked,
  clearSearch,
  updateScrollPosition,
} from "reducers/search.reducer";
import styled, { css } from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebounce } from "hooks";
import { KEYS } from "../util";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import Button from "components/Button";
import Select from "components/Select";
import config from "config";
import Api from "api-client";
import { ArrowDown as ArrowDownStyled } from "common.styles";

const { isElectron } = config;

const Container = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  margin-top: var(--titlebar-height);

  input {
    width: 100%;

    ::placeholder {
      color: #919191;
      font-size: 0.9em;
    }
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
`;

const Wrapper = styled.div`
  display: flex;
  overflow: auto;

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
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  > div:nth-of-type(1),
  > div:nth-of-type(3) {
    min-width: 345px;
    max-width: 345px;
    margin-right: 10px;
    position: relative;
  }

  > button:first-of-type {
    margin-right: 10px;
  }
`;

const SearchInputContainer = styled.div`
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

    :hover {
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
  max-width: 100px;
  max-height: 40px;
  justify-self: end;
  align-self: center;
`;

const RandomButton = styled(Button)`
  ${buttonStyles}
`;

const ClearButton = styled(Button)`
  ${buttonStyles}
`;

const Search = ({
  query,
  filter,
  artists,
  albums,
  audios,
  isSearchRandom,
  isSearchTermLocked,
  scrollPos,
  listingWithLabels,
  dispatch,
}) => {
  const [previousFilter, setPreviousFilter] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isDeletingFilter, setIsDeletingFilter] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showGenreSelect, setShowGenreSelect] = useState(false);
  const queryToBackend = useDebounce(query, 300);
  const artistListRef = useRef();
  const albumListRef = useRef();
  const audioListRef = useRef();

  useEffect(() => {
    if (filter) {
      const [artistFilter, albumFilter] = filter.split(",");
      const firstChar = artistFilter.substring(0, 1).toUpperCase();
      const strictArtists = (listingWithLabels[firstChar] || []).filter((a) =>
        a.name.toLowerCase().includes(artistFilter.toLowerCase())
      );

      if (!albumFilter) {
        if (strictArtists.length > 1 && filter.trim().endsWith(",")) {
          Api.getArtistAlbums(strictArtists[0].id).then((artist) => {
            const mappedFiles = artist.albums
              .map((a) =>
                a.files.map((f) => ({
                  ...f,
                  coverUrl: a.coverUrl,
                }))
              )
              .flat(Infinity);

            dispatch(
              setSearchResults({
                artists: strictArtists,
                albums: artist.albums,
                audios: [...mappedFiles, ...artist.files],
              })
            );
          });
        } else if (strictArtists.length > 1) {
          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: [],
              audios: [],
            })
          );
        } else if (strictArtists.length === 1) {
          Api.getArtistAlbums(strictArtists[0].id).then((artist) => {
            const mappedFiles = artist.albums
              .map((a) =>
                a.files.map((f) => ({
                  ...f,
                  coverUrl: a.coverUrl,
                }))
              )
              .flat(Infinity);

            dispatch(
              setSearchResults({
                artists: strictArtists,
                albums: artist.albums,
                audios: [...mappedFiles, ...artist.files],
              })
            );

            if (
              !isDeletingFilter &&
              previousFilter !== `${filter},` &&
              !filter.endsWith(",")
            ) {
              dispatch(setFilter(`${filter},`));
            }
          });
        }
      } else if (albumFilter && filter.length > previousFilter.length) {
        const strictAlbums = albums.filter(
          (a) =>
            a?.name.toLowerCase().startsWith(albumFilter) ||
            a?.metadata?.album.toLowerCase().startsWith(albumFilter)
        );

        if (strictAlbums.length > 1) {
          const mappedFiles = strictAlbums
            .map((a) =>
              a.files.map((f) => ({
                ...f,
                coverUrl: a.coverUrl,
              }))
            )
            .flat(Infinity);

          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: strictAlbums,
              audios: mappedFiles,
            })
          );
        } else if (strictAlbums.length === 1) {
          const mappedFiles = strictAlbums[0].files.map((f) => ({
            ...f,
            coverUrl: strictAlbums[0].coverUrl,
          }));

          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: strictAlbums,
              audios: mappedFiles,
            })
          );
        }
      } else if (albumFilter) {
        Api.getArtistAlbums(strictArtists[0].id).then((artist) => {
          const strictAlbums = artist.albums.filter((a) =>
            a.name.toLowerCase().startsWith(albumFilter)
          );

          const mappedFiles = strictAlbums
            .map((a) =>
              a.files.map((f) => ({
                ...f,
                coverUrl: a.coverUrl,
              }))
            )
            .flat(Infinity);

          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: strictAlbums,
              audios: mappedFiles,
            })
          );
        });
      }

      dispatch(setQuery(""));
    } else if (
      !isSearchRandom &&
      !isFetching &&
      filter.length < 1 &&
      query.length < 1
    ) {
      dispatch(
        setSearchResults({
          artists: [],
          albums: [],
          audios: [],
        })
      );
    }

    setPreviousFilter(filter);

    if (filter) {
      dispatch(setIsSearchRandom(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, listingWithLabels]);

  useEffect(() => {
    if (queryToBackend && !isSearchTermLocked) {
      Api.find(queryToBackend).then((result) => {
        dispatch(
          setSearchResults({
            artists: result.artists,
            albums: result.albums,
            audios: result.audios,
          })
        );
        dispatch(setFilter(""));
      });

      dispatch(setIsSearchRandom(false));
      dispatch(updateScrollPosition({ artists: 0, albums: 0, audios: 0 }));
      artistListRef.current.scrollTop = 0;
      albumListRef.current.scrollTop = 0;
      audioListRef.current.scrollTop = 0;
    } else if (
      !isSearchRandom &&
      !isFetching &&
      filter.length < 1 &&
      query.length < 1
    ) {
      dispatch(
        setSearchResults({
          artists: [],
          albums: [],
          audios: [],
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToBackend]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setIsDeletingFilter(
        event?.target?.tagName === "INPUT" &&
          (event.keyCode === KEYS.Backspace || event.keyCode === KEYS.Delete)
      );
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    artistListRef.current.scrollTop = scrollPos.artists;
    albumListRef.current.scrollTop = scrollPos.albums;
    audioListRef.current.scrollTop = scrollPos.audios;
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
    : Object.values(listingWithLabels).flat(Infinity);

  // NOTE: Need to keep track of this because at least on Windows
  //       when going from long scrolled list to a short one that can not be
  //       scrolled, when React re-renders it scrolls the list elements to top
  //       before it replaces the elements inside of them causing an annoying
  //       flash of different albums covers and titles
  const isFetchingRandomFirstTime = isFetching && !isSearchRandom;

  const updateQuery = (e) => {
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

  const setGenre = (event) => {
    dispatch(setIsSearchTermLocked(false));
    dispatch(setQuery(`g:${event.target.textContent}`));
    setShowGenreSelect(false);
  };

  const toggleGenreSelect = () => {
    setShowGenreSelect(!showGenreSelect);
  };

  return (
    <Container>
      <ContainerWrapper>
        <InputContainer>
          <div>
            <input
              autoFocus
              value={filter}
              placeholder="Filter by artist,album"
              onChange={(e) => dispatch(setFilter(e.target.value))}
            />
          </div>
          <div />
          <SearchInputContainer query={query}>
            <input
              value={query}
              placeholder="Search by term or year"
              onChange={updateQuery}
            />
            <ArrowDown onClick={toggleGenreSelect} />
            <Select showSelect={showGenreSelect} top={45} maxWidth={345}>
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
          <RandomButton isPrimary isSmall onClick={findRandom}>
            Random
          </RandomButton>
          <ClearButton isSecondary isSmall onClick={clear}>
            Clear
          </ClearButton>
        </InputContainer>
        <Wrapper>
          <SearchBlock>
            <h5>Artists{` (${artistToRender.length})`}</h5>
            <SearchBlockWrapper
              ref={artistListRef}
              onScroll={(event) => {
                dispatch(
                  updateScrollPosition({ artists: event.target.scrollTop })
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
            <h5>Albums{` (${albums.length})`}</h5>
            <SearchBlockWrapper
              ref={albumListRef}
              onScroll={(event) => {
                dispatch(
                  updateScrollPosition({ albums: event.target.scrollTop })
                );
              }}
            >
              {React.useMemo(
                () =>
                  isFetchingRandomFirstTime ? (
                    <div>...</div>
                  ) : (
                    albums.map((a, i) => {
                      return <Album key={i} item={a} filter={filter} />;
                    })
                  ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [albums, isFetchingRandomFirstTime]
              )}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Songs{` (${audios.length})`}</h5>
            <SearchBlockWrapper
              ref={audioListRef}
              onScroll={(event) => {
                dispatch(
                  updateScrollPosition({ audios: event.target.scrollTop })
                );
              }}
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
                [audios, isFetchingRandomFirstTime]
              )}
            </SearchBlockWrapper>
          </SearchBlock>
        </Wrapper>
      </ContainerWrapper>
    </Container>
  );
};

export default connect(
  (state) => ({
    query: state.search.query,
    filter: state.search.filter,
    artists: state.search.searchArtists,
    albums: state.search.searchAlbums,
    audios: state.search.searchAudios,
    isSearchRandom: state.search.isRandom,
    isSearchTermLocked: state.search.isSearchTermLocked,
    scrollPos: state.search.scrollPos,
    listingWithLabels: state.library.listingWithLabels,
  }),
  (dispatch) => ({ dispatch })
)(Search);
