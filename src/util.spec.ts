import { songFixture } from "./components/Song/Song.fixture";
import { FALLBACK_THEME } from "./config";
import { addToast, removeToast } from "./reducers/toaster.reducer";
import {
  cleanUrl,
  dispatchToast,
  formatDuration,
  getQueryStringAsObject,
  getReplaygainDb,
  isCtrlDown,
  prefixNumber,
  REPLAYGAIN_TYPE,
  updateCurrentTheme,
} from "./util";

describe("Util", () => {
  describe("getReplaygainDb()", () => {
    it("returns track gain for track", () => {
      expect(getReplaygainDb(REPLAYGAIN_TYPE.Track, songFixture)).toBe(
        songFixture.metadata.replayGainTrackGain?.dB,
      );
    });

    it("returns album gain as fallback for track", () => {
      const fixture = <any>{ metadata: { replayGainAlbumGain: { dB: -1.23 } } };

      expect(getReplaygainDb(REPLAYGAIN_TYPE.Track, fixture)).toBe(-1.23);
    });

    it("returns 0 as a fallback for track", () => {
      expect(getReplaygainDb(REPLAYGAIN_TYPE.Track, <any>{})).toBe(0);
    });

    it("returns album gain for album", () => {
      expect(getReplaygainDb(REPLAYGAIN_TYPE.Album, songFixture)).toBe(
        songFixture.metadata.replayGainAlbumGain?.dB,
      );
    });

    it("returns track gain as fallback for album", () => {
      const fixture = <any>{ metadata: { replayGainTrackGain: { dB: -2.34 } } };

      expect(getReplaygainDb(REPLAYGAIN_TYPE.Album, fixture)).toBe(-2.34);
    });

    it("returns 0 as a fallback for album", () => {
      expect(getReplaygainDb(REPLAYGAIN_TYPE.Album, <any>{})).toBe(0);
    });

    it("returns 0 for off", () => {
      expect(getReplaygainDb(REPLAYGAIN_TYPE.Off, <any>{})).toBe(0);
    });
  });

  describe("formatDuration()", () => {
    it("returns string as it is", () => {
      expect(formatDuration("1:23")).toBe("1:23");
    });

    it("returns 0:00 for undefined", () => {
      expect(formatDuration()).toBe("0:00");
    });

    it("returns 0:00 for less than 1", () => {
      expect(formatDuration(0.5)).toBe("0:00");
    });

    it("returns under 1 minute with 0 minutes and seconds", () => {
      expect(formatDuration(42)).toBe("0:42");
    });

    it("returns over 1 minute in minutes and seconds", () => {
      expect(formatDuration(102)).toBe("1:42");
    });

    it("returns over 10 minutes in minutes and seconds", () => {
      expect(formatDuration(666)).toBe("11:06");
    });

    it("returns over 60 minutes in hours, minutes and seconds", () => {
      expect(formatDuration(60 * 66 + 12)).toBe("01:06:12");
    });
  });

  describe("prefixNumber()", () => {
    it("prefixes number with 0 when under 10", () => {
      expect(prefixNumber(9)).toBe("09");
    });

    it("does not prefix number over 9", () => {
      expect(prefixNumber(10)).toBe("10");
    });
  });

  describe("cleanUrl()", () => {
    it("returns empty string for nullish values", () => {
      expect(cleanUrl(undefined)).toBe("");
      expect(cleanUrl(null)).toBe("");
      expect(cleanUrl("")).toBe("");
    });

    it("returns empty string for non-strings", () => {
      expect(cleanUrl(1)).toBe("");
      expect(cleanUrl({})).toBe("");
    });

    it("replaces # in a url with %23", () => {
      expect(cleanUrl("https://example.com/#")).toBe("https://example.com/%23");
    });
  });

  describe("updateCurrentTheme()", () => {
    it("update document.body.style with theme colors", () => {
      updateCurrentTheme(FALLBACK_THEME);

      expect((<any>document.body.style)._values).toEqual({
        "--color-bg": "rgb(33,37,43)",
        "--color-primary-highlight": "rgb(117,53,151)",
        "--color-secondary-highlight": "rgb(33,115,126)",
        "--color-slider": "rgb(117,53,151)",
        "--color-typography": "#fbfbfb",
        "--color-typography-ghost": "#d2d2d2",
        "--color-typography-primary": "#fbfbfb",
        "--color-typography-secondary": "#fbfbfb",
      });
    });
  });

  describe("dispatchToast()", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const mockDispatch = vi.fn();

    it("calls dispatch function with add and remove toast actions", () => {
      const message = "message";
      const key = "key";
      dispatchToast(message, key, mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(addToast(message, key));
      vi.runAllTimers();

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(removeToast(key));
    });
  });

  describe("isCtrlDown()", () => {
    it("returns true for ctrlKey", () => {
      expect(isCtrlDown(<any>{ ctrlKey: true })).toBe(true);
    });

    it("returns true for metaKey", () => {
      expect(isCtrlDown(<any>{ metaKey: true })).toBe(true);
    });
  });

  describe("getQueryStringAsObject()", () => {
    it("deserializes url query string to object", () => {
      expect(
        getQueryStringAsObject("https://example.com?foo=bar&baz=baa"),
      ).toEqual({
        baz: "baa",
        foo: "bar",
      });
    });
  });
});
