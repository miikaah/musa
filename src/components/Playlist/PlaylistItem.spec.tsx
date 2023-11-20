import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaylistItem from "./PlaylistItem";
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
const mockToggleModal = vi.fn();
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

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId("PlaylistItemEditButton")).toBeInTheDocument();
    expect(screen.getByTestId("PlaylistItemDeleteButton")).toBeInTheDocument();
    expect(screen.getByTestId("PlaylistItemDeleteButtonIcon")).toHaveClass(
      "fa-xmark",
    );
    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(track)).toBeInTheDocument();
    expect(screen.getByText(duration)).toBeInTheDocument();
  });

  it("renders play icon when isPlaying", async () => {
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
      state2,
    );

    expect(screen.getByTestId("PlaylistItemPlayIcon")).toHaveClass("fa-play");
  });

  it("renders pause icon when not isPlaying", async () => {
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

    expect(screen.getByTestId("PlaylistItemPauseIcon")).toHaveClass("fa-pause");
  });

  it("calls dispatch with replay action", async () => {
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

    await userEvent.dblClick(screen.getByTestId("PlaylistItemContainer"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ replay: true }),
    );
  });

  it("calls dispatch and onSetActiveIndex on double click", async () => {
    render(
      <PlaylistItem
        item={albumFixture.files[0] as any}
        index={0}
        activeIndex={0}
        startIndex={0}
        endIndex={0}
        isSelected={false}
        isMovingItems={false}
        onSetActiveIndex={mockOnSetActiveIndex}
        onMouseOverItem={vi.fn()}
        onMouseDownItem={vi.fn()}
        onMouseUpItem={vi.fn()}
        onScrollPlaylist={vi.fn()}
        toggleModal={vi.fn()}
        removeItems={vi.fn()}
      />,
      state2,
    );

    await userEvent.dblClick(screen.getByTestId("PlaylistItemContainer"));

    expect(mockDispatch).toHaveBeenCalledWith(playIndex(0));
    expect(mockOnSetActiveIndex).toHaveBeenCalledWith(0);
  });

  it("calls onMouseOverItem when mouse over playlist item", async () => {
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
        onMouseOverItem={mockOnMouseOverItem}
        onMouseDownItem={vi.fn()}
        onMouseUpItem={vi.fn()}
        onScrollPlaylist={vi.fn()}
        toggleModal={vi.fn()}
        removeItems={vi.fn()}
      />,
      state,
    );

    fireEvent.mouseOver(screen.getByTestId("PlaylistItemContainer"));

    expect(mockOnMouseOverItem).toHaveBeenCalledWith(0);
  });

  it("calls onMouseDownItem when presses mouse down on playlist item", async () => {
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
        onMouseDownItem={mockOnMouseDownItem}
        onMouseUpItem={vi.fn()}
        onScrollPlaylist={vi.fn()}
        toggleModal={vi.fn()}
        removeItems={vi.fn()}
      />,
      state,
    );

    const user = userEvent.setup();
    await user.keyboard("{Control>}{Shift>}");
    await user.click(screen.getByTestId("PlaylistItemContainer"));

    expect(mockOnMouseDownItem).toHaveBeenCalledWith({
      index: 0,
      isCtrlDown: true,
      isShiftDown: true,
    });
  });

  it("calls onMouseUpItem when presses mouse up on playlist item", async () => {
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
        onMouseUpItem={mockOnMouseUpItem}
        onScrollPlaylist={vi.fn()}
        toggleModal={vi.fn()}
        removeItems={vi.fn()}
      />,
      state,
    );

    const user = userEvent.setup();
    await user.keyboard("{Control>}{Shift>}");
    await user.click(screen.getByTestId("PlaylistItemContainer"));

    expect(mockOnMouseUpItem).toHaveBeenCalledWith({
      index: 0,
      isCtrlDown: true,
      isShiftDown: true,
    });
  });

  it("calls toggleModal on edit button click", async () => {
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
        toggleModal={mockToggleModal}
        removeItems={vi.fn()}
      />,
      state,
    );

    await userEvent.click(screen.getByTestId("PlaylistItemEditButton"));

    expect(mockToggleModal).toHaveBeenCalledWith([audioFixture]);
  });

  it("calls removeItems on remove button click", async () => {
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
        removeItems={mockRemoveItems}
      />,
      state,
    );

    await userEvent.click(screen.getByTestId("PlaylistItemDeleteButton"));

    expect(mockRemoveItems).toHaveBeenCalledOnce();
  });
});
