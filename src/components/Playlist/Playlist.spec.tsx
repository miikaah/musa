import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Playlist from "./Playlist";
import { artistFixture } from "../../fixtures/artist.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const mockToggleModal = vi.fn();

const t = translate("en");
const title = String(artistFixture.albums[0].files[0].metadata?.title);
const title2 = String(artistFixture.albums[0].files[2]?.metadata?.title);
const titleText = String(t("playlist.instructions.title"));
const playControlsText = String(t("playlist.instructions.playControls"));
const playPauseText = String(t("playlist.instructions.playPause"));
const spacebarText = String(t("playlist.instructions.spacebar"));
const muteText = String(t("playlist.instructions.mute"));
const toggleSearchText = String(t("playlist.instructions.toggleSearch"));
const playlistControlsText = String(
  t("playlist.instructions.playlistControls"),
);
const playReplayText = String(t("playlist.instructions.playReplay"));
const selectText = String(t("playlist.instructions.select"));
const clickAndDragText = String(t("playlist.instructions.clickAndDrag"));
const selectAllText = String(t("playlist.instructions.selectAll"));
const cutText = String(t("playlist.instructions.cut"));
const copyText = String(t("playlist.instructions.copy"));
const pasteText = String(t("playlist.instructions.paste"));
const removeText = String(t("playlist.instructions.remove"));
const backspaceOrDeleteText = String(
  t("playlist.instructions.backspaceOrDelete"),
);
const duplicateSelectionText = String(
  t("playlist.instructions.duplicateSelection"),
);
const moveItemWithPointerText = String(
  t("playlist.instructions.moveItemWithPointer"),
);
const longPressText = String(t("playlist.instructions.longPress"));
const moveUpText = String(t("playlist.instructions.moveUp"));
const upArrowText = String(t("playlist.instructions.upArrow"));
const moveDownText = String(t("playlist.instructions.moveDown"));
const downArrowText = String(t("playlist.instructions.downArrow"));
const touchControlsText = String(t("playlist.instructions.touchControls"));
const doubleTapText = String(t("playlist.instructions.doubleTap"));
const addFromLibraryText = String(t("playlist.instructions.addFromLibrary"));

const state = {
  player: {
    items: artistFixture.albums[0].files,
    currenItem: artistFixture.albums[0].files[0],
    currentIndex: 0,
  },
  settings: { t },
};

const state2 = {
  player: {
    items: [],
    currenItem: undefined,
    currentIndex: 0,
  },
  settings: { t },
};

describe("Playlist", () => {
  it("renders Playlist component", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders instructions when playlist is empty", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state2);

    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(titleText)).toBeInTheDocument();
    expect(screen.getByText(playControlsText)).toBeInTheDocument();
    expect(screen.getByText(playPauseText)).toBeInTheDocument();
    expect(screen.getByText(spacebarText)).toBeInTheDocument();
    expect(screen.getByText(muteText)).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText(toggleSearchText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + Shift + F")).toBeInTheDocument();
    expect(screen.getByText(playlistControlsText)).toBeInTheDocument();
    expect(screen.getAllByText(playReplayText).length).toBe(2);
    expect(screen.getByText("Enter")).toBeInTheDocument();
    expect(screen.getByText(selectText)).toBeInTheDocument();
    expect(screen.getByText(clickAndDragText)).toBeInTheDocument();
    expect(screen.getByText(selectAllText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + A")).toBeInTheDocument();
    expect(screen.getByText(cutText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + X")).toBeInTheDocument();
    expect(screen.getByText(copyText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + C")).toBeInTheDocument();
    expect(screen.getByText(pasteText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + V")).toBeInTheDocument();
    expect(screen.getByText(removeText)).toBeInTheDocument();
    expect(screen.getByText(backspaceOrDeleteText)).toBeInTheDocument();
    expect(screen.getByText(duplicateSelectionText)).toBeInTheDocument();
    expect(screen.getByText("Ctrl / Cmd + Shift + D")).toBeInTheDocument();
    expect(screen.getByText(moveItemWithPointerText)).toBeInTheDocument();
    expect(screen.getAllByText(longPressText).length).toBe(2);
    expect(screen.getByText(moveUpText)).toBeInTheDocument();
    expect(screen.getByText(upArrowText)).toBeInTheDocument();
    expect(screen.getByText(moveDownText)).toBeInTheDocument();
    expect(screen.getByText(downArrowText)).toBeInTheDocument();
    expect(screen.getByText(touchControlsText)).toBeInTheDocument();
    expect(screen.getByText(doubleTapText)).toBeInTheDocument();
    expect(screen.getByText(addFromLibraryText)).toBeInTheDocument();
  });

  it("dispatches remove items action during select all", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.keyboard("{Control>}a{/Control}");
    await userEvent.keyboard("{Backspace}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      }),
    );
  });

  it("dispatches play index action", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.click(screen.getByText(title));
    await userEvent.keyboard("{Enter}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 0,
      }),
    );
  });

  it("dispatches remove items action during cut", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.click(screen.getByText(title2));
    await userEvent.keyboard("{Control>}x{/Control}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        indexes: [2],
      }),
    );
  });

  it("dispatches paste to playlist action during copy + paste", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.click(screen.getByText(title2));
    await userEvent.keyboard("{Control>}c{/Control}");
    await userEvent.keyboard("{Control>}v{/Control}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 2,
        items: [artistFixture.albums[0].files[2]],
      }),
    );
  });

  it("dispatches paste to playlist action during duplicate", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.click(screen.getByText(title));
    await userEvent.keyboard("{Control>}{Shift>}d{/Shift}{/Control}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 0,
        items: [artistFixture.albums[0].files[0]],
      }),
    );
  });

  // Small d does not work with Windows
  it("dispatches paste to playlist action during duplicate with D key", async () => {
    render(<Playlist toggleModal={vi.fn()} />, state);

    await userEvent.click(screen.getByText(title));
    await userEvent.keyboard("{Control>}{Shift>}D{/Shift}{/Control}");

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 0,
        items: [artistFixture.albums[0].files[0]],
      }),
    );
  });

  it("calls toggle modal click handler", async () => {
    render(<Playlist toggleModal={mockToggleModal} />, state);

    await userEvent.click(screen.getAllByTestId("PlaylistItemEditButton")[0]);

    expect(mockToggleModal).toHaveBeenCalledWith([
      artistFixture.albums[0].files[0],
    ]);
  });
});
