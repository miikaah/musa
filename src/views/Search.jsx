import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setQuery,
  setFilter,
  setSearchResults,
  setIsSearchRandom,
  clearSearch,
} from "reducers/library.reducer";
import styled, { css } from "styled-components/macro";
import { useDebounce } from "hooks";
import { KEYS } from "../util";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import Button from "components/Button";
import config from "config";
import Api from "api-client";

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
  min-height: ${({ isElectron }) => (isElectron ? 730 : 640)}px;
  max-height: ${({ isElectron }) => (isElectron ? 730 : 640)}px;
  background: #fff;
  padding: 10px 0 0 10px;
  overflow: auto;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  > input {
    width: 345px;
    margin-right: 10px;
  }

  > button:first-of-type {
    margin-right: 10px;
  }
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
  listingWithLabels,
  isSearchRandom,
  dispatch,
}) => {
  const [previousFilter, setPreviousFilter] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isDeletingFilter, setIsDeletingFilter] = useState(false);
  const queryToBackend = useDebounce(query, 300);

  useEffect(() => {
    if (filter && filter !== `${previousFilter},`) {
      const [artistFilter, albumFilter] = filter.split(",");
      const firstChar = artistFilter.substring(0, 1).toUpperCase();
      const strictArtists = (listingWithLabels[firstChar] || []).filter((a) =>
        a.name.toLowerCase().includes(artistFilter.toLowerCase())
      );

      if (!albumFilter) {
        if (strictArtists.length > 1) {
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
    if (queryToBackend) {
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

    if (queryToBackend) {
      dispatch(setIsSearchRandom(false));
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

  const findRandom = () => {
    setIsFetching(true);
    dispatch(setQuery(""));
    dispatch(setFilter(""));
    dispatch(setIsSearchRandom(true));

    Api.findRandom().then((result) => {
      dispatch(setSearchResults(result));
      setIsFetching(false);
    });
  };

  const artistToRender = artists.length
    ? artists
    : Object.values(listingWithLabels).flat(Infinity);

  return (
    <Container>
      <ContainerWrapper>
        <InputContainer>
          <input
            autoFocus
            value={filter}
            placeholder="...Filter by artist,album"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          <div />
          <input
            value={query}
            placeholder="...Search"
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <RandomButton isPrimary isSmall onClick={findRandom}>
            Random
          </RandomButton>
          <ClearButton
            isSecondary
            isSmall
            onClick={() => dispatch(clearSearch())}
          >
            Clear
          </ClearButton>
        </InputContainer>
        <Wrapper>
          <SearchBlock>
            <h5>Artists{` (${artistToRender.length})`}</h5>
            <SearchBlockWrapper isElectron={isElectron}>
              {artistToRender.map((a, i) => (
                <Artist key={i} item={a} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Albums{` (${albums.length})`}</h5>
            <SearchBlockWrapper isElectron={isElectron}>
              {albums.map((a, i) => (
                <Album key={i} item={a} filter={filter} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Songs{` (${audios.length})`}</h5>
            <SearchBlockWrapper isElectron={isElectron}>
              {audios.map((a, i) => (
                <Song key={i} item={a} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
        </Wrapper>
      </ContainerWrapper>
    </Container>
  );
};

export default connect(
  (state) => ({
    query: state.library.query,
    filter: state.library.filter,
    artists: state.library.searchArtists,
    albums: state.library.searchAlbums,
    audios: state.library.searchAudios,
    listingWithLabels: state.library.listingWithLabels,
    isSearchRandom: state.library.isRandom,
  }),
  (dispatch) => ({ dispatch })
)(Search);
