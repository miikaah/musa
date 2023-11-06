import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cover from "./Cover";
import { audioFixture } from "../../fixtures/audio.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import Api from "../../apiClient";
import { FALLBACK_THEME } from "../../config";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../apiClient");

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
    expect((screen.getByTestId("CoverImage") as HTMLImageElement).src).toBe(
      "media:///CMX/Aurinko/Aurinko.jpg",
    );
  });

  it("renders Theme component when clicking edit button", async () => {
    render(<Cover />, state);

    expect(screen.queryByTestId("ThemeBlockContainer")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();
  });
});
