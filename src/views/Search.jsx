import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setQuery } from "reducers/library.reducer";
import styled from "styled-components/macro";
import { useThrottle } from "hooks";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import BasePage from "components/BasePage";
import Button from "components/Button";

const { REACT_APP_ENV, REACT_APP_API_BASE_URL: baseUrl } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const SearchContainer = styled.div`
  input {
    width: 100%;

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
  ${({ height }) =>
    height &&
    `
    min-height: ${height}px;
    max-height: ${height}px;
  `}
  background: #fff;
  padding: 10px 0 0 10px;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 85fr 15fr;
  margin-bottom: 20px;
`;

const RandomButton = styled(Button)`
  max-width: 100px;
  max-height: 40px;
  justify-self: end;
  align-self: center;
`;

const Search = ({ query, artistAlbums, artistSongs, dispatch }) => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [audios, setAudios] = useState([]);

  const queryToBackend = useThrottle(query, ipc ? 0 : 16);

  useEffect(() => {
    if (ipc) {
      ipc.once("musa:find:response", (event, result) => {
        setArtists(result.artists);
        setAlbums(result.albums);
        setAudios(result.audios);
      });
      ipc.send("musa:find:request", queryToBackend);
    } else {
      if (queryToBackend) {
        fetch(`${baseUrl}/find/${queryToBackend}`)
          .then((response) => response.json())
          .then((result) => {
            setArtists(result.artists);
            setAlbums(result.albums);
            setAudios(result.audios);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToBackend]);

  const findRandom = () => {
    if (ipc) {
      ipc.once("musa:find:response:random", (event, result) => {
        setArtists(result.artists);
        setAlbums(result.albums);
        setAudios(result.audios);
      });
      ipc.send("musa:find:request:random");
    }
  };

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
        <InputContainer>
          <input
            autoFocus
            value={query}
            placeholder="...Don't type too fast"
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <RandomButton isPrimary isSmall onClick={findRandom}>
            Random
          </RandomButton>
        </InputContainer>
        <SearchBlock>
          <h3>Artists</h3>
          <SearchBlockWrapper height={43}>
            {renderSearchResults(artists, "artists")}
          </SearchBlockWrapper>
        </SearchBlock>
        <SearchBlock>
          <h3>Albums</h3>
          <SearchBlockWrapper height={240}>
            {renderSearchResults(albums, "albums")}
          </SearchBlockWrapper>
        </SearchBlock>
        <SearchBlock>
          <h3>Songs</h3>
          <SearchBlockWrapper height={306}>
            {renderSearchResults(audios, "songs")}
          </SearchBlockWrapper>
        </SearchBlock>
      </SearchContainer>
    </BasePage>
  );
};

export default withRouter(
  connect(
    (state) => ({
      query: state.library.query,
    }),
    (dispatch) => ({ dispatch })
  )(Search)
);
