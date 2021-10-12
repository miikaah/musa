import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setQuery } from "reducers/library.reducer";
import styled from "styled-components/macro";
import { useThrottle } from "../hooks";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import BasePage from "components/BasePage";

const { REACT_APP_ENV, REACT_APP_API_BASE_URL: baseUrl } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const SearchContainer = styled.div`
  input {
    width: 100%;
    margin-bottom: 20px;

    ::placeholder {
      color: #919191;
      font-size: 0.9em;
    }
  }
`;

const SearchBlock = styled.div`
  margin-bottom: 12px;
  color: #000;

  h3 {
    color: var(--color-typography);
  }
`;

const SearchBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: ${({ minHeight }) => minHeight && `${minHeight}px`};
  background: #fff;
  padding: 10px 0 0 10px;
`;

const Search = ({ listing, query, artistAlbums, artistSongs, dispatch }) => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [audios, setAudios] = useState([]);

  const throttledQuery = useThrottle(query, ipc ? 0 : 16);

  useEffect(() => {
    if (ipc) {
      ipc.once("musa:find:response", (event, result) => {
        setArtists(result.artists);
        setAlbums(result.albums);
        setAudios(result.audios);
      });
      ipc.send("musa:find:request", throttledQuery);
    } else {
      if (throttledQuery) {
        fetch(`${baseUrl}/find/${throttledQuery}`)
          .then((response) => response.json())
          .then((result) => {
            setArtists(result.artists);
            setAlbums(result.albums);
            setAudios(result.audios);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledQuery]);

  const renderSearchResults = (results, type) => {
    switch (type) {
      case "artists": {
        return results.map((r, i) => <Artist key={i} item={r} />);
      }
      case "albums": {
        return results.map((r, i) => <Album key={i} item={r} />);
      }
      case "songs": {
        return results.map((r, i) => <Song key={i} item={r} />);
      }
      default:
        return null;
    }
  };

  return (
    <BasePage>
      <SearchContainer>
        <div>
          <input
            autoFocus
            value={query}
            placeholder="...Don't type too fast"
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <SearchBlock>
            <h3>Artists</h3>
            <SearchBlockWrapper minHeight={43}>
              {renderSearchResults(artists, "artists")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h3>Albums</h3>
            <SearchBlockWrapper minHeight={270}>
              {renderSearchResults(albums, "albums")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h3>Songs</h3>
            <SearchBlockWrapper minHeight={306}>
              {renderSearchResults(audios, "songs")}
            </SearchBlockWrapper>
          </SearchBlock>
        </div>
      </SearchContainer>
    </BasePage>
  );
};

export default withRouter(
  connect(
    (state) => ({
      listing: state.library.listing,
      query: state.library.query,
    }),
    (dispatch) => ({ dispatch })
  )(Search)
);
