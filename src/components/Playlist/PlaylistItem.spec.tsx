import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaylistItem from "./PlaylistItem";
import { audioFixture } from "../../fixtures/audio.fixture";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const title = String(audioFixture.metadata.title);
const album = String(audioFixture.metadata.album);
const artist = String(audioFixture.metadata.artist);

const state = {
  player: {
    currentItem: audioFixture,
    currentIndex: 0,
    isPlaying: false,
  },
};

describe("PlaylistItem", () => {
  it("renders PlaylistItem component", async () => {
    render(
      <PlaylistItem
        item={audioFixture}
        index={0}
        activeIndex={0}
        startIndex={0}
        endIndex={0}
        isSelected={false}
        isMovingItems={false}
        onSetActiveIndex={vi.fn()}
        onMouseOverItem={vi.fn()}
        onMouseDownItem={vi.fn()}
        onMouseUpItem={vi.fn()}
        onScrollPlaylist={vi.fn()}
        toggleModal={vi.fn()}
        removeItems={vi.fn()}
      />,
      state,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
  });
});
