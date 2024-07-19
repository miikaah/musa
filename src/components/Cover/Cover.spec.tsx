import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cover from "./Cover";
import { audioFixture } from "../../fixtures/audio.fixture";
import { paletteFixture } from "../../fixtures/palette.fixture";
import { themeFixture } from "../../fixtures/theme.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { FALLBACK_THEME } from "../../config";
import { Swatch } from "../../img-palette/img-palette";
import * as Api from "../../apiClient";
import { setCoverData } from "../../reducers/player.reducer";
import { updateSettings } from "../../reducers/settings.reducer";
import { cleanUrl } from "../../util";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../util", async () => ({
  ...(await vi.importActual("../../util")),
  cleanUrl: vi.fn().mockImplementation((url) => url),
}));

vi.mock("../../apiClient");
vi.mocked(Api.insertTheme).mockResolvedValue(themeFixture);
vi.mocked(Api.updateTheme).mockResolvedValue(themeFixture);

vi.mock("../../img-palette/img-palette", async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    "../../img-palette/img-palette",
  )),
  default: class PaletteMock {
    quality: number;
    colorCount: number;
    swatches: Swatch[];
    highestPopulation: number;
    vibrantSwatch: Swatch | null;
    lightVibrantSwatch: Swatch | null;
    darkVibrantSwatch: Swatch | null;
    mutedSwatch: Swatch | null;
    lightMutedSwatch: Swatch | null;
    darkMutedSwatch: Swatch | null;

    constructor() {
      this.quality = paletteFixture.quality;
      this.colorCount = paletteFixture.colorCount;
      this.swatches = paletteFixture.swatches as any;
      this.highestPopulation = paletteFixture.highestPopulation;
      this.vibrantSwatch = paletteFixture.vibrantSwatch as any;
      this.lightVibrantSwatch = paletteFixture.lightVibrantSwatch as any;
      this.darkVibrantSwatch = paletteFixture.darkVibrantSwatch as any;
      this.mutedSwatch = paletteFixture.mutedSwatch as any;
      this.lightMutedSwatch = paletteFixture.lightMutedSwatch;
      this.darkMutedSwatch = paletteFixture.darkMutedSwatch as any;
    }
  },
}));

class Canvas2dContextMock {
  drawImage() {}
  getImageData() {
    return {
      data: paletteFixture.vibrantSwatch.rgb,
    };
  }
}

window.HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(new Canvas2dContextMock());

const album = String(audioFixture.metadata.album);
const artist = String(audioFixture.metadata.artist);
const year = String(audioFixture.metadata.year);

const state = {
  player: {
    currentItem: audioFixture,
    coverData: {
      isCoverLoaded: false,
      scaleDownImage: false,
      maxHeight: 420,
    },
  },
  settings: {
    currentTheme: {
      colors: FALLBACK_THEME,
      filename: "",
      id: "",
    },
    t: translate("en"),
  },
};

describe("Cover", () => {
  it("renders Cover component", async () => {
    render(<Cover />, state);

    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();
    expect(screen.getByTestId("CoverImage")).toBeInTheDocument();
    expect(screen.getByTestId<HTMLImageElement>("CoverImage").src).toBe(
      "media:///CMX/Aurinko/Aurinko.jpg",
    );
    expect(cleanUrl).toHaveBeenCalledWith("media:///CMX/Aurinko/Aurinko.jpg");
  });

  it("renders Theme component when clicking edit button", async () => {
    render(<Cover />, state);
    expect(screen.queryByTestId("ThemeBlockContainer")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();
  });

  it("sets cover on img load event and calls side-effects", async () => {
    render(<Cover />, state);

    waitFor(() => {
      fireEvent.load(screen.getByTestId("CoverImage"), {
        target: {
          src: "foo",
        },
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setCoverData({
        isCoverLoaded: true,
        scaleDownImage: false,
        maxHeight: 0,
      }),
    );

    await waitFor(() => {
      expect(Api.getThemeById).toHaveBeenCalledWith({
        id: "http://localhost:3000/foo",
      });
    });

    await waitFor(() => {
      expect(Api.insertTheme).toHaveBeenCalledWith({
        id: "http://localhost:3000/foo",
        colors: themeFixture.colors,
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSettings({
        currentTheme: themeFixture,
      }),
    );
  });

  it("clicks image when not editing", async () => {
    render(<Cover />, state);

    await userEvent.click(screen.getByTestId("CoverImage"));
    expect(Api.updateTheme).not.toHaveBeenCalled();
  });

  it("clicks image when editing bg color", async () => {
    render(<Cover />, state);

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("ThemeBlockContainer"));
    await userEvent.click(screen.getByTestId("CoverImage"));
    expect(Api.updateTheme).toHaveBeenCalledWith({
      id: "media:///CMX/Aurinko/Aurinko.jpg",
      colors: {
        bg: [247, 228, 73],
        primary: [117, 53, 151],
        secondary: [33, 115, 126],
        slider: [117, 53, 151],
        typography: "#000",
        typographyGhost: "#4a4a4a",
        typographyPrimary: "#fbfbfb",
        typographySecondary: "#fbfbfb",
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      updateSettings({
        currentTheme: themeFixture,
      }),
    );
  });

  it("clicks image when editing primary color", async () => {
    render(<Cover />, state);

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("ThemeBlockColorPrimary"));
    await userEvent.click(screen.getByTestId("CoverImage"));
    expect(Api.updateTheme).toHaveBeenCalledWith({
      id: "media:///CMX/Aurinko/Aurinko.jpg",
      colors: {
        bg: [33, 37, 43],
        primary: [247, 228, 73],
        secondary: [33, 115, 126],
        slider: [247, 228, 73],
        typography: "#fbfbfb",
        typographyGhost: "#d2d2d2",
        typographyPrimary: "#000",
        typographySecondary: "#fbfbfb",
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      updateSettings({
        currentTheme: themeFixture,
      }),
    );
  });

  it("clicks image when editing secondary color", async () => {
    render(<Cover />, state);

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("ThemeBlockColorSecondary"));
    await userEvent.click(screen.getByTestId("CoverImage"));
    expect(Api.updateTheme).toHaveBeenCalledWith({
      id: "media:///CMX/Aurinko/Aurinko.jpg",
      colors: {
        bg: [33, 37, 43],
        primary: [117, 53, 151],
        secondary: [247, 228, 73],
        slider: [117, 53, 151],
        typography: "#fbfbfb",
        typographyGhost: "#d2d2d2",
        typographyPrimary: "#fbfbfb",
        typographySecondary: "#000",
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      updateSettings({
        currentTheme: themeFixture,
      }),
    );
  });

  it("dispatches set cover data action on resize", async () => {
    render(<Cover />, state);

    waitFor(() => {
      global.innerWidth = 1024;
      fireEvent.resize(window);
    });

    waitFor(() => {
      global.innerWidth = 420;
      fireEvent.resize(window);
    });

    waitFor(() => {
      global.innerWidth = 2048;
      fireEvent.resize(window);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setCoverData({
        isCoverLoaded: true,
        scaleDownImage: false,
        maxHeight: 0,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });
});
