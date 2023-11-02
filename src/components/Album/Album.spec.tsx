import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Album from "./Album";
import { albumFixture } from "./Album.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { dispatchToast } from "../../util";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../util");

const album = String(albumFixture.metadata.album);
const artist = String(albumFixture.metadata.artist);
const year = String(albumFixture.metadata.year);

describe("Album", () => {
  it("renders Album component", async () => {
    render(<Album item={albumFixture} />, {
      settings: { t: translate("en") },
    });

    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();
  });

  it("renders null when empty item", async () => {
    render(<Album item={undefined} />, {
      settings: { t: translate("en") },
    });

    expect(screen.queryByText(album)).not.toBeInTheDocument();
    expect(screen.queryByText(artist)).not.toBeInTheDocument();
    expect(screen.queryByText(year)).not.toBeInTheDocument();
  });

  it("dispatches set album to search query action", async () => {
    render(<Album item={albumFixture} />, {
      settings: { t: translate("en") },
    });

    await userEvent.click(screen.getByText(album));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `album:${album}` }),
    );
  });

  it("dispatches set artist to search query action", async () => {
    render(<Album item={albumFixture} />, {
      settings: { t: translate("en") },
    });

    await userEvent.click(screen.getByText(artist));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `artist:${artist}` }),
    );
  });

  it("dispatches set year to search query action", async () => {
    render(<Album item={albumFixture} />, {
      settings: { t: translate("en") },
    });

    await userEvent.click(screen.getByText(year));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `year:${year}` }),
    );
  });

  it("dispatches add album songs to playlist action", async () => {
    render(<Album item={albumFixture} />, {
      settings: { t: translate("en") },
    });

    await userEvent.click(screen.getByTestId("AlbumFullAdd"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ items: albumFixture.files }),
    );
    expect(dispatchToast).toHaveBeenCalledWith(
      `Added ${album} to playlist`,
      expect.any(String),
      expect.any(Function),
    );
  });
});
