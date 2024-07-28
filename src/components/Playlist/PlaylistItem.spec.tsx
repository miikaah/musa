import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaylistItem, { playlistItemContextMenuClassName } from "./PlaylistItem";
import { audioFixture } from "../../fixtures/audio.fixture";
import { albumFixture } from "../../fixtures/album.fixture";
import { render } from "../../../test/render";
import { formatDuration } from "../../util";
import { playIndex } from "../../reducers/player.reducer";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const mockOnSetActiveIndex = vi.fn();
const mockRemoveItems = vi.fn();
const mockOnMouseOverItem = vi.fn();
const mockOnMouseDownItem = vi.fn();
const mockOnMouseUpItem = vi.fn();

const artist = String(audioFixture.metadata.artist);
const album = String(audioFixture.metadata.album);
const title = String(audioFixture.metadata.title);
const track = String(audioFixture.track);
const duration = formatDuration(audioFixture.metadata.duration);

const state = {
  player: {
    currentItem: audioFixture,
    currentIndex: 0,
    isPlaying: false,
  },
};

const state2 = {
  player: {
    currentItem: audioFixture,
    currentIndex: 0,
    isPlaying: true,
  },
};

const renderComponent = (state: any, options?: any) => {
  render(
    <PlaylistItem
      item={audioFixture}
      isSelected={false}
      onScrollPlaylist={vi.fn()}
      onContextMenu={vi.fn()}
      onDoubleClick={vi.fn()}
      onRemoveItems={options?.mockRemoveItems ?? vi.fn()}
    />,
    state,
  );
};

describe("PlaylistItem", () => {
  it("renders PlaylistItem component", async () => {
    renderComponent(state);

    expect(screen.getByAltText("Album image")).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByTestId(playlistItemContextMenuClassName),
    ).toBeInTheDocument();
    expect(screen.getByTestId("PlaylistItemDeleteButton")).toBeInTheDocument();
    expect(screen.getByTestId("PlaylistItemDeleteButtonIcon")).toHaveClass(
      "fa-xmark",
    );
    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(track)).toBeInTheDocument();
    expect(screen.getByText(duration)).toBeInTheDocument();
  });

  it("calls removeItems on remove button click", async () => {
    renderComponent(state, { mockRemoveItems });

    await userEvent.click(screen.getByTestId("PlaylistItemDeleteButton"));

    expect(mockRemoveItems).toHaveBeenCalledOnce();
  });
});
