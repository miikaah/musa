import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerCurrentlyPlaying from "./PlayerCurrentlyPlaying";
import { audioFixture } from "../../fixtures/audio.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const title = String(audioFixture.metadata.title);
const artist = String(audioFixture.metadata.artist);

const missingData = {
  ...audioFixture,
  name: "",
  coverUrl: "",
  metadata: {
    ...audioFixture.metadata,
    artist: "",
    title: "",
  },
};

describe("PlayerCurrentlyPlaying", () => {
  it("renders PlayerCurrentlyPlaying component", async () => {
    render(<PlayerCurrentlyPlaying currentItem={audioFixture} />, {});

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole<HTMLImageElement>("img").src).toBe(
      "media:///CMX/Aurinko/Aurinko.jpg",
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
  });

  it("renders null when empty item", async () => {
    render(<PlayerCurrentlyPlaying currentItem={undefined} />, {});

    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(artist)).not.toBeInTheDocument();
  });

  it("renders placeholders when currentItem has missing data", async () => {
    render(<PlayerCurrentlyPlaying currentItem={missingData} />, {});

    expect(screen.getByTestId("PlaceholderImage")).toBeInTheDocument();
    expect(screen.getByTestId("PlaceholderLine1")).toBeInTheDocument();
    expect(screen.getByTestId("PlaceholderLine2")).toBeInTheDocument();
  });
});
