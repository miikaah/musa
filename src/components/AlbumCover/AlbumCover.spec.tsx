import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlbumCover from "./AlbumCover";
import { albumCoverFixture } from "../../fixtures/albumCover.fixture";
import { render } from "../../../test/render";
import { translate } from "../../i18n";

const mockOnClick = vi.fn();

const name = String(albumCoverFixture.name);
const year = String(albumCoverFixture.year);

const state = {
  settings: { t: translate("en") },
};

describe("AlbumCover", () => {
  it("renders AlbumCover component", async () => {
    render(<AlbumCover item={albumCoverFixture} />, state);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();
  });

  it("calls onClick handler on click", async () => {
    render(
      <AlbumCover item={albumCoverFixture} onClick={mockOnClick} />,
      state,
    );

    await userEvent.click(screen.getByTestId("AlbumCoverContainer"));

    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
