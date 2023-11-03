import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Artist from "./Artist";
import { artistFixture } from "./Artist.fixture";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const title = String(artistFixture.name);

const state = {};

describe("Artist", () => {
  it("renders Artist component", async () => {
    render(<Artist item={artistFixture} />, state);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders null when empty item", async () => {
    render(<Artist item={undefined} />, state);

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("dispatches set artist to search query action", async () => {
    render(<Artist item={artistFixture} />, state);

    await userEvent.click(screen.getByText(title));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ query: `artist:${title.toLowerCase()}` }),
    );
  });
});
