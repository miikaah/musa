import { AudioWithMetadata } from "@miikaah/musa-core";
import { artistFixture } from "../fixtures/artist.fixture";
import reducer, {
  initialState,
  pause,
  play,
  playIndex,
  playNext,
  replay,
} from "./player.reducer";

const playlist = artistFixture.albums[0].files as AudioWithMetadata[];

const state = {
  ...initialState,
  items: playlist,
};
const state2 = {
  ...initialState,
  items: playlist,
  currentIndex: 0,
  currentItem: playlist[0],
};
const state3 = {
  ...initialState,
  items: [playlist[1], playlist[1]],
  currentIndex: 0,
  currentItem: playlist[1],
};

describe("Player reducer", () => {
  describe("play", () => {
    const item = {
      coverUrl: playlist[0].coverUrl,
      currentIndex: 0,
      currentItem: playlist[0],
      isPlaying: true,
      src: playlist[0].fileUrl,
    };

    it("sets isPlaying to false when empty playlist", () => {
      expect(reducer(initialState, play())).toEqual(initialState);
    });

    it("sets current item to the first playlist item when no currentItem", () => {
      expect(reducer(state, play())).toEqual({
        ...state,
        ...item,
      });
    });

    it("keeps the currentItem as is when has currentItem", () => {
      expect(reducer(state2, play())).toEqual({
        ...state,
        ...item,
      });
    });
  });

  describe("playIndex", () => {
    it("resets state when index is out of bounds", () => {
      expect(reducer(state, playIndex(playlist.length))).toEqual(state);
    });

    it("moves to the next index", () => {
      expect(reducer(state2, playIndex(1))).toEqual({
        ...state2,
        coverUrl: playlist[1].coverUrl,
        currentIndex: 1,
        currentItem: playlist[1],
        isPlaying: true,
        src: playlist[1].fileUrl,
        previousCoverUrl: playlist[0].coverUrl,
        coverData: {
          ...state2.coverData,
          isCoverLoaded: true,
        },
      });
    });

    it("sets reset = true and moves to the next index when playlist has duplicate items", () => {
      expect(reducer(state3, playIndex(1))).toEqual({
        ...state3,
        coverUrl: playlist[1].coverUrl,
        currentIndex: 1,
        currentItem: playlist[1],
        isPlaying: true,
        src: playlist[1].fileUrl,
        previousCoverUrl: "",
        replay: true,
      });
    });
  });

  describe("playNext", () => {
    it("resets state when index is out of bounds", () => {
      expect(reducer(initialState, playNext())).toEqual(initialState);
    });

    it("moves to the next index", () => {
      expect(reducer(state2, playNext())).toEqual({
        ...state2,
        coverUrl: playlist[1].coverUrl,
        currentIndex: 1,
        currentItem: playlist[1],
        isPlaying: true,
        src: playlist[1].fileUrl,
        previousCoverUrl: playlist[0].coverUrl,
        coverData: {
          ...state2.coverData,
          isCoverLoaded: true,
        },
      });
    });
  });

  describe("replay", () => {
    it("sets replay", () => {
      expect(reducer(state2, replay(true))).toEqual({
        ...state2,
        replay: true,
      });
    });
  });

  describe("pause", () => {
    it("sets isPlaying to false", () => {
      expect(reducer({ ...state2, isPlaying: true }, pause())).toEqual({
        ...state2,
        isPlaying: false,
      });
    });
  });
});
