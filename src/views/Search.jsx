import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setQuery, setSearchResults } from "reducers/library.reducer";
import styled from "styled-components/macro";
import { useDebounce } from "hooks";
import Song from "components/Song";
import Album from "components/Album";
import BasePage from "components/BasePage";
import Button from "components/Button";
import config from "config";
import Api from "api-client";

const { isElectron } = config;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  input {
    width: 100%;

    ::placeholder {
      color: #919191;
      font-size: 0.9em;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;

  > div:first-child {
    margin-right: 20px;
  }
`;

const SearchBlock = styled.div`
  flex: 50%;
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
      <Container>
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
        <Wrapper>
          <SearchBlock>
            <h5>Albums</h5>
            <SearchBlockWrapper>
              {albums.map((r, i) => (
                <Album key={i} item={r} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
          <SearchBlock>
            <h5>Songs</h5>
            <SearchBlockWrapper>
              {audios.map((r, i) => (
                <Song key={i} item={r} />
              ))}
            </SearchBlockWrapper>
          </SearchBlock>
        </Wrapper>
      </Container>
    </BasePage>
  );
};

export default connect(
  (state) => ({
    query: state.library.query,
    artists: state.library.searchArtists,
    albums: state.library.searchAlbums,
    audios: state.library.searchAudios,
  }),
  (dispatch) => ({ dispatch })
)(Search);
