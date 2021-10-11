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
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [audios, setAudios] = useState([]);

  const throttledQuery = useThrottle(query, 16);

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
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <SearchBlock>
            <h2>Artists</h2>
            <SearchBlockWrapper>
              {renderSearchResults(artists, "artists")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Albums</h2>
            <SearchBlockWrapper>
              {renderSearchResults(albums, "albums")}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h2>Songs</h2>
            <SearchBlockWrapper>
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
