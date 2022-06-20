import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setQuery,
  setFilter,
  setSearchResults,
} from "reducers/library.reducer";
import styled from "styled-components/macro";
import { useDebounce } from "hooks";
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

  @media (min-width: 1350px) {
    width: 90%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  overflow: auto;

  > div:first-child {
    min-width: 250px;
    max-width: 250px;
  }

  > div:not(:first-child) {
    min-width: 449.81px;
    max-width: 449.81px;
  }

  > div:not(:last-child) {
    margin-right: 20px;
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
  min-height: 730px;
  max-height: 730px;
  background: #fff;
  padding: 10px 0 0 10px;
  overflow: auto;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  input:first-child {
    min-width: 449.81px;
  }

  input {
    width: 449.81px;
    margin-right: 20px;
  }
`;

const RandomButton = styled(Button)`
  max-width: 100px;
  max-height: 40px;
  justify-self: end;
  align-self: center;
`;

const Search = ({
  query,
  filter,
  artists,
  albums,
  audios,
  listingWithLabels,
  dispatch,
}) => {
  const [previousFilter, setPreviousFilter] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const queryToBackend = useDebounce(query, isElectron ? 0 : 16);

  useEffect(() => {
    if (filter && filter !== `${previousFilter},`) {
      const [artistFilter, albumFilter] = filter.split(",");
      const firstChar = artistFilter.substring(0, 1).toUpperCase();
      const strictArtists = (listingWithLabels[firstChar] || []).filter((a) =>
        a.name.toLowerCase().startsWith(artistFilter.toLowerCase())
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
            dispatch(
              setSearchResults({
                artists: strictArtists,
                albums: artist.albums,
                audios: [],
              })
            );

            if (previousFilter !== `${filter},` && !filter.endsWith(",")) {
              dispatch(setFilter(`${filter},`));
            }
          });
        }
      } else if (albumFilter && filter.length > previousFilter.length) {
        const strictAlbums = albums.filter((a) =>
          a.name.toLowerCase().startsWith(albumFilter)
        );

        if (strictAlbums.length > 1) {
          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: strictAlbums,
              audios: [],
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

          dispatch(
            setSearchResults({
              artists: strictArtists,
              albums: strictAlbums,
              audios: [],
            })
          );
        });
      }

      dispatch(setQuery(""));
    } else if (!isFetching && filter.length < 1 && query.length < 1) {
      dispatch(
        setSearchResults({
          artists: [],
          albums: [],
          audios: [],
        })
      );
    }

    setPreviousFilter(filter);
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
    } else if (!isFetching && filter.length < 1 && query.length < 1) {
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

  const findRandom = () => {
    setIsFetching(true);
    dispatch(setQuery(""));
    dispatch(setFilter(""));

    Api.findRandom().then((result) => {
      dispatch(setSearchResults(result));
      setIsFetching(false);
    });
  };

  return (
    <Container>
      <ContainerWrapper>
        <InputContainer>
          <input
            autoFocus
            value={filter}
            placeholder="...Filter"
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
        </InputContainer>
        <Wrapper>
          <SearchBlock>
            <h5>Artists</h5>
            <SearchBlockWrapper>
              {(artists.length
                ? artists
                : Object.values(listingWithLabels).flat(Infinity)
              ).map((a, i) => (
                <Artist key={i} item={a} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Albums</h5>
            <SearchBlockWrapper>
              {albums.map((a, i) => (
                <Album key={i} item={a} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Songs</h5>
            <SearchBlockWrapper>
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
  }),
  (dispatch) => ({ dispatch })
)(Search);
