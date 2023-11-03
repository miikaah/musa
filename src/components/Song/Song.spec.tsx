import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Song from "./Song";
import { songFixture } from "./Song.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { dispatchToast } from "../../util";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../util");

const title = String(songFixture.metadata.title);
const album = String(songFixture.metadata.album);
const artist = String(songFixture.metadata.artist);
const year = String(songFixture.metadata.year);

const state = {
  settings: { t: translate("en") },
};

describe("Song", () => {
  it("renders Song component", async () => {
    render(<Song item={songFixture} />, state);

    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();
  });

  it("renders null when empty item", async () => {
    render(<Song item={undefined} />, state);

    expect(screen.queryByText(album)).not.toBeInTheDocument();
    expect(screen.queryByText(artist)).not.toBeInTheDocument();
    expect(screen.queryByText(year)).not.toBeInTheDocument();
  });

  it("dispatches set title to search query action", async () => {
    render(<Song item={songFixture} />, state);

    await userEvent.click(screen.getByText(title));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: title }),
    );
  });

  it("dispatches set album to search query action", async () => {
    render(<Song item={songFixture} />, state);

    await userEvent.click(screen.getByText(album));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `album:${album}` }),
    );
  });

  it("dispatches set artist to search query action", async () => {
    render(<Song item={songFixture} />, state);

    await userEvent.click(screen.getByText(artist));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `artist:${artist}` }),
    );
  });

  it("dispatches set year to search query action", async () => {
    render(<Song item={songFixture} />, state);

    await userEvent.click(screen.getByText(year));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `year:${year}` }),
    );
  });

  it("dispatches add album songs to playlist action", async () => {
    render(<Song item={songFixture} />, state);

    await userEvent.click(screen.getByTestId("SongContainer"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ item: songFixture }),
    );
    expect(dispatchToast).toHaveBeenCalledWith(
      `Added ${title} to playlist`,
      expect.any(String),
      expect.any(Function),
    );
  });
});
