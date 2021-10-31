import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setQuery, setSearchResults } from "reducers/library.reducer";
import styled from "styled-components/macro";
import { useDebounce } from "hooks";
import Song from "components/Song";
import Album from "components/Album";
import Artist from "components/Artist";
import BasePage from "components/BasePage";
import Button from "components/Button";
import config from "config";
import Api from "api-client";

const { isElectron } = config;

const SearchContainer = styled.div`
  padding-bottom: 60px;

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

const Search = ({ query, artists, albums, audios, dispatch }) => {
  const queryToBackend = useDebounce(query, isElectron ? 0 : 16);

  useEffect(() => {
    if (queryToBackend) {
      Api.find(queryToBackend).then((result) => {
        dispatch(setSearchResults(result));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToBackend]);

  const findRandom = () => {
    Api.findRandom().then((result) => {
      dispatch(setQuery(""));
      dispatch(setSearchResults(result));
    });
  };

  return (
    <BasePage>
      <SearchContainer>
        <InputContainer>
          <input
            autoFocus
            value={query}
            placeholder="...Search"
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <RandomButton isPrimary isSmall onClick={findRandom}>
            Random
          </RandomButton>
        </InputContainer>
        <SearchBlock>
          <h3>Artists</h3>
          <SearchBlockWrapper height={43}>
            {artists.map((r, i) => (
              <Artist key={i} item={r} />
            ))}
          </SearchBlockWrapper>
        </SearchBlock>
        <SearchBlock>
          <h3>Albums</h3>
          <SearchBlockWrapper height={200}>
            {albums.map((r, i) => (
              <Album key={i} item={r} />
            ))}
          </SearchBlockWrapper>
        </SearchBlock>
        <SearchBlock>
          <h3>Songs</h3>
          <SearchBlockWrapper height={300}>
            {audios.map((r, i) => (
              <Song key={i} item={r} />
            ))}
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
      artists: state.library.searchArtists,
      albums: state.library.searchAlbums,
      audios: state.library.searchAudios,
    }),
    (dispatch) => ({ dispatch })
  )(Search)
);
