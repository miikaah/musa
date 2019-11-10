import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setQuery } from "reducers/library.reducer";
import fuzzysort from "fuzzysort";
import styled from "styled-components/macro";
import { useThrottle } from "../hooks";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import BasePage from "components/BasePage";

const SearchContainer = styled.div`
  input {
    width: 100%;
  }

  > div {
    margin-bottom: 100px;
  }
`;

const SearchBlock = styled.div`
  margin-top: 40px;

  > h2 {
    margin-bottom: 40px;
  }
`;

const SearchBlockWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Search = ({ listing, query, artistAlbums, artistSongs, dispatch }) => {
  const [searchArtists, setSearchArtists] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const options = { limit: 10, key: "name", threshold: -50 };

  const throttledQuery = useThrottle(query, 16);

  useEffect(() => {
    const artists = fuzzysort.go(query, listing, options);
    const albums = fuzzysort.go(query, artistAlbums, options);
    const songs = fuzzysort.go(query, artistSongs, options);
    setSearchArtists(artists);
    setSearchAlbums(albums);
    setSearchSongs(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledQuery]);

  const renderSearchResults = (results, type) => {
    switch (type) {
      case "artists": {
        return results.map((r, i) => <Artist key={i} item={r.obj} />);
      }
      case "albums": {
        return results.map((r, i) => <Album key={i} item={r.obj} />);
      }
      case "songs": {
        return results.map((r, i) => <Song key={i} item={r.obj} />);
      }
      default:
        return null;
    }
  };

  return (
    <BasePage>
      <SearchContainer>
        <h1>Search</h1>
        <div>
          <input
            autoFocus
            value={query}
            onChange={e => dispatch(setQuery(e.target.value))}
          />
          <SearchBlock>
            <h2>Artists</h2>
            <SearchBlockWrapper>
              {renderSearchResults(searchArtists, "artists")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Albums</h2>
            <SearchBlockWrapper>
              {renderSearchResults(searchAlbums, "albums")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Songs</h2>
            <SearchBlockWrapper>
              {renderSearchResults(searchSongs, "songs")}
            </SearchBlockWrapper>
          </SearchBlock>
        </div>
      </SearchContainer>
    </BasePage>
  );
};

export default withRouter(
  connect(
    state => ({
      listing: state.library.listing,
      query: state.library.query,
      artistAlbums: state.library.albums,
      artistSongs: state.library.songs
    }),
    dispatch => ({ dispatch })
  )(Search)
);
