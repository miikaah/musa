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

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Search = ({ query, artists, albums, songs, spotifyToken, dispatch }) => {
  const [searchArtists, setSearchArtists] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [spotifyArtists, setSpotifyArtists] = useState([]);
  const [spotifyAlbums, setSpotifyAlbums] = useState([]);
  const [spotifySongs, setSpotifySongs] = useState([]);
  const options = { limit: 10, key: "name", threshold: -50 };

  const throttledQuery = useThrottle(query, 16);
  const throttledSpotifyQuery = useThrottle(query, 543);

  const handleSpotifySearchResults = () => {
    ipcRenderer.on("GotSpotifySearchResults", (event, spotifyResults) => {
      setSpotifyArtists(spotifyResults.artists.items);
      setSpotifyAlbums(spotifyResults.albums.items);
      setSpotifySongs(spotifyResults.tracks.items);
    });
  };
  useEffect(handleSpotifySearchResults, []);

  useEffect(() => {
    const localArtists = fuzzysort.go(throttledQuery, artists, options);
    const localAlbums = fuzzysort.go(throttledQuery, albums, options);
    const localSongs = fuzzysort.go(throttledQuery, songs, options);
    setSearchArtists(localArtists.map(a => a.obj));
    setSearchAlbums(localAlbums.map(a => a.obj));
    setSearchSongs(localSongs.map(a => a.obj));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledQuery]);

  useEffect(() => {
    ipcRenderer.send("SpotifySearch", spotifyToken, throttledSpotifyQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledSpotifyQuery]);

  const renderSearchResults = (results, type) => {
    switch (type) {
      case "artists": {
        return results.map((item, i) => <Artist key={i} item={item} />);
      }
      case "albums": {
        return results.map((item, i) => <Album key={i} item={item} />);
      }
      case "songs": {
        return results.map((item, i) => <Song key={i} item={item} />);
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
              {renderSearchResults(
                [...searchArtists, ...spotifyArtists],
                "artists"
              )}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Albums</h2>
            <SearchBlockWrapper>
              {renderSearchResults(
                [...searchAlbums, ...spotifyAlbums],
                "albums"
              )}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Songs</h2>
            <SearchBlockWrapper>
              {renderSearchResults([...searchSongs, ...spotifySongs], "songs")}
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
      query: state.library.query,
      artists: state.library.listing,
      albums: state.library.albums,
      songs: state.library.songs,
      spotifyToken: state.settings.spotify.accessToken
    }),
    dispatch => ({ dispatch })
  )(Search)
);
