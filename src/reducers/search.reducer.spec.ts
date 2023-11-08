import { albumFixture } from "../fixtures/album.fixture";
import { artistFixture } from "../fixtures/artist.fixture";
import { audioFixture } from "../fixtures/audio.fixture";
import reducer, {
  clearSearch,
  initialState,
  setFilter,
  setIsSearchRandom,
  setIsSearchTermLocked,
  setQuery,
  setSearchResults,
  updateScrollPosition,
} from "./search.reducer";

const results = {
  artists: [artistFixture],
  albums: [albumFixture],
  audios: [audioFixture],
};

const scrollPos = {
  artists: 1,
  albums: 2,
  audios: 3,
};

describe("Search reducer", () => {
  it("sets search query", () => {
    const query = "foo";

    expect(reducer(undefined, setQuery(query))).toEqual({
      ...initialState,
      query,
      isRandom: false,
      isSearchTermLocked: false,
    });
  });

  it("sets artist filter", () => {
    const filter = "c";

    expect(reducer(undefined, setFilter(filter))).toEqual({
      ...initialState,
      filter,
    });
  });

  it("sets isRandom", () => {
    const isRandom = true;

    expect(reducer(undefined, setIsSearchRandom(isRandom))).toEqual({
      ...initialState,
      isRandom,
    });
  });

  it("sets isSearchTermLocked", () => {
    const isSearchTermLocked = true;

    expect(
      reducer(undefined, setIsSearchTermLocked(isSearchTermLocked)),
    ).toEqual({
      ...initialState,
      isSearchTermLocked,
    });
  });

  it("sets search results", () => {
    expect(reducer(undefined, setSearchResults(results))).toEqual({
      ...initialState,
      searchArtists: results.artists,
      searchAlbums: results.albums,
      searchAudios: results.audios,
    });
  });

  it("clears search results", () => {
    expect(
      reducer(
        {
          ...initialState,
          searchArtists: results.artists,
          searchAlbums: results.albums,
          searchAudios: results.audios,
          ...scrollPos,
        },
        clearSearch(),
      ),
    ).toEqual({
      ...initialState,
      searchArtists: [],
      searchAlbums: [],
      searchAudios: [],
      ...scrollPos,
    });
  });

  it("updates scroll position", () => {
    expect(reducer(initialState, updateScrollPosition(scrollPos))).toEqual({
      ...initialState,
      scrollPos,
    });
  });
});
