import { AudioWithMetadata } from "@miikaah/musa-core";
import React, { useState, useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import isEqual from "lodash.isequal";
import styled, { css } from "styled-components";
import {
  pasteToPlaylist,
  removeIndexesFromPlaylist,
  playIndex,
  replay,
  PlayerState,
  pasteToPlaylistHead,
} from "../../reducers/player.reducer";
import { isCtrlDown } from "../../util";
import { KEYS } from "../../config";
import { useKeyPress } from "../../hooks";
import { listOverflow } from "../../common.styles";
import { breakpoints } from "../../breakpoints";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import PlaylistItem, {
  PlaylistItemOptions,
  contextMenuButtonId,
  playlistItemMaxHeight,
} from "./PlaylistItem";
import ContextMenu, {
  ContextMenuCoordinates,
  contextMenuId,
} from "../ContextMenu";
import { EditorMode } from "../../types";

const titleBarHeight = 36;
const playlistPaddingTop = 14;
const playlistRowsStartY = titleBarHeight + playlistPaddingTop;

const commonCss = css<{ isSmall: boolean }>`
  padding: ${playlistPaddingTop}px 0;
  margin: 0;
  border: 0 solid var(--color-primary-highlight);
  border-left-width: 1px;
  border-right-width: 3px;
  background-color: var(--color-bg);
  max-height: 89vh;
  max-width: ${({ isSmall }) => (isSmall ? "600px" : "10000px")};
`;

const Container = styled.ul<{ isSmall: boolean; hideOverflow: boolean }>`
  ${commonCss}
  ${listOverflow}
  overflow-y: ${({ hideOverflow }) => (hideOverflow ? "hidden" : "auto")};
  overflow-x: hidden;
  width: ${({ isSmall }) => (isSmall ? "auto" : "100%")};
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin: 0 auto;
    max-width: 96vw;
    max-height: unset;
    overflow: unset;
    padding-bottom: 200px;
  }
`;

const Instructions = styled.div<{ isSmall: boolean }>`
  ${commonCss}
  ${listOverflow}
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin: 0 auto;
    max-width: 96vw;
    overflow: hidden;
    padding-bottom: 200px;
  }
`;

const InstructionsWrapper = styled.div`
  margin: 0 auto;
  max-width: 90%;

  > p:first-of-type {
    text-align: center;
    font-weight: bold;
    margin: 0 auto;
    padding: 0 20px 40px 20px;
    max-width: 360px;
  }

  > div,
  p {
    opacity: 0.3666;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    > p:first-of-type {
      text-align: center;
      font-weight: bold;
      margin: 0;
      padding: 0;
      max-width: unset;
    }
  }
`;

const ControlsInstructions = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  align-self: center;
`;

const ControlsHeader = styled.div`
  display: flex;
  margin: 20px 0 8px;
  font-weight: bold;
  font-size: 14px;
`;

const ControlsInstruction = styled.div`
  display: flex;
  font-size: 13px;

  > div:first-of-type {
    width: 60%;
    text-align: left;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 10px;
  }
`;

type MoveMarkerCoordinates = {
  x: number;
  y: number;
};

const MoveMarker = styled.div<{ coordinates: MoveMarkerCoordinates }>`
  width: 100%;
  height: 4px;
  background: var(--color-typography);
  position: absolute;
  top: ${({ coordinates }) => coordinates.y}px;
  left: 0;
`;

let moveTimeout: NodeJS.Timeout;

const playlistClassName = "playlist";

type MouseUpDownOptions = {
  index: number;
  isShiftDown: boolean;
  isCtrlDown: boolean;
  isMultiSelect: boolean;
  isRightClick: boolean;
  isContextMenuButtonClick: boolean;
  stopPropagation: boolean;
};

type PlaylistProps = {
  playlist: PlayerState["items"];
  currentItem: PlayerState["currentItem"];
  currentIndex: PlayerState["currentIndex"];
  toggleModal: (
    mode: "normalization" | "metadata",
    activeIndex: number,
    items: AudioWithMetadata[],
  ) => void;
  t: TranslateFn;
};

const Playlist = ({
  playlist,
  currentItem,
  currentIndex,
  toggleModal,
  t,
}: PlaylistProps) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoints.lg);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMovingItems, setIsMovingItems] = useState(false);
  const [pointerStartY, setPointerStartY] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(NaN);
  const [endIndex, setEndIndex] = useState(NaN);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    new Set(),
  );
  const [clipboard, setClipboard] = useState<AudioWithMetadata[]>([]);
  const [hideOverflow, setHideOverflow] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] =
    useState<ContextMenuCoordinates | null>(null);
  const [moveMarkerCoordinates, setMoveMarkerCoordinates] =
    useState<MoveMarkerCoordinates | null>(null);
  const dispatch = useDispatch();

  const playlistRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      setIsSmall(window.innerWidth < breakpoints.lg);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelectedIndexes = () => {
    return Array.from(selectedIndexes.values()).sort();
  };

  const getSelectedItems = () => {
    return getSelectedIndexes().map((i) => playlist[i]);
  };

  const getActiveIndex = (tail = false) => {
    const arr = getSelectedIndexes();
    const index = tail ? arr.pop() : arr[0];
    return index !== undefined && index > -1 ? index : -1;
  };

  const selectAll = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    setSelectedIndexes(new Set(playlist.map((_, i) => i)));
  };
  useKeyPress(KEYS.a, selectAll);

  const moveUp = (event: KeyboardEvent) => {
    event.preventDefault();
    const activeIndex = getActiveIndex();
    if (activeIndex > -1) {
      setSelectedIndexes(new Set([activeIndex - 1]));
    } else {
      setSelectedIndexes(new Set([playlist.length - 1]));
    }
  };
  useKeyPress(KEYS.Up, moveUp);

  const moveDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const activeIndex = getActiveIndex();
    if (activeIndex + 1 < playlist.length) {
      setSelectedIndexes(new Set([activeIndex + 1]));
    } else {
      setSelectedIndexes(new Set([0]));
    }
  };
  useKeyPress(KEYS.Down, moveDown);

  const playOrReplay = () => {
    const activeIndex = getActiveIndex();
    const shouldReplay =
      activeIndex === currentIndex &&
      isEqual(currentItem, playlist[activeIndex]);

    if (shouldReplay) {
      console.log("replay", activeIndex);
      dispatch(replay(true));
    } else {
      console.log("play", activeIndex);
      dispatch(playIndex(activeIndex));
    }
  };
  useKeyPress(KEYS.Enter, playOrReplay);

  const removeItems = () => {
    setClipboard(getSelectedItems());
    dispatch(removeIndexesFromPlaylist(getSelectedIndexes()));
    setSelectedIndexes(new Set());
  };
  useKeyPress(KEYS.Backspace, removeItems);
  useKeyPress(KEYS.Delete, removeItems);

  const cut = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    removeItems();
  };
  useKeyPress(KEYS.x, cut);

  const copy = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    setClipboard(getSelectedItems());
  };
  useKeyPress(KEYS.c, copy);

  const duplicate = (event: KeyboardEvent) => {
    if (!isCtrlDown(event) || !event.shiftKey) return;
    dispatch(pasteToPlaylist(getSelectedItems(), getActiveIndex(true)));
  };
  useKeyPress(KEYS.d, duplicate);
  useKeyPress(KEYS.D, duplicate);

  const pasteItems = (activeIndex: number, items = clipboard) => {
    console.log("paste", activeIndex, items);
    dispatch(
      pasteToPlaylist(items, activeIndex < 0 ? playlist.length : activeIndex),
    );
  };

  const paste = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    pasteItems(getActiveIndex(true));
  };
  useKeyPress(KEYS.v, paste);

  // Playlist mouse events

  const resolvePlaylistBoundingClientRect = () => {
    const rect = playlistRef.current?.getBoundingClientRect();
    if (!rect) {
      throw new Error(
        "Playlist bounding client rect not defined. Should not happen.",
      );
    }

    return rect;
  };

  const resolvePlaylistItemIndex = (clientY: number) => {
    const rect = resolvePlaylistBoundingClientRect();
    const y = clientY - rect.y - playlistPaddingTop + 1;
    const index = Math.trunc(y / playlistItemMaxHeight);
    const playlistItemIndex = Object.is(index, -0)
      ? 0
      : index > playlist.length - 1
        ? playlist.length - 1
        : index;

    return playlistItemIndex;
  };

  const resolveContextMenuBoundingClientRect = () => {
    return document.getElementById(contextMenuId)?.getBoundingClientRect();
  };

  const resolveIsContextMenuItemClick = (
    clientX: number,
    clientY: number,
    rect?: DOMRect,
  ) => {
    if (!rect) {
      return false;
    }
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  const resolveIsClearSelectionClick = (clientY: number) => {
    return (
      clientY < playlistRowsStartY ||
      clientY > playlistRowsStartY + playlistItemMaxHeight * playlist.length
    );
  };

  const resolveMouseOptions = (
    event: React.MouseEvent<HTMLElement>,
  ): MouseUpDownOptions => {
    const { clientX, clientY } = event;
    const contextMenuRect = resolveContextMenuBoundingClientRect();
    const isContextMenuItemClick = resolveIsContextMenuItemClick(
      clientX,
      clientY,
      contextMenuRect,
    );
    const isClearSelectionClick = resolveIsClearSelectionClick(event.clientY);
    const newIndex = isClearSelectionClick
      ? -1
      : resolvePlaylistItemIndex(event.clientY);
    const id = `${contextMenuButtonId}-${newIndex}`;
    const target = event.target as HTMLElement;
    const isContextMenuButtonClick =
      target?.id === id || target.parentElement?.id === id;

    return {
      index: newIndex,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey,
      isMultiSelect: selectedIndexes.size > 1 && selectedIndexes.has(newIndex),
      isRightClick: event.button === 2,
      isContextMenuButtonClick,
      stopPropagation: isContextMenuItemClick,
    };
  };

  const clearSelection = () => {
    setIsMouseDown(false);
    setStartIndex(NaN);
    setEndIndex(NaN);
    setSelectedIndexes(new Set());
    setIsMovingItems(false);
  };

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    const options = resolveMouseOptions(event);
    console.log("mousedown");
    // console.log("mousedown", options);
    // console.log({
    //   startIndex,
    //   endIndex,
    // });
    // console.log("selected", selectedIndexes);
    setPointerStartY(event.clientY);
    setIsMouseDown(true);
    setIsMovingItems(false);
    setMoveMarkerCoordinates(null);

    if (options.stopPropagation) {
      return;
    }
    if (options.isContextMenuButtonClick) {
      setStartIndex(options.index);
      setEndIndex(options.index);
      setSelectedIndexes(
        options.index > -1 ? new Set([options.index]) : new Set(),
      );
      return;
    }
    setContextMenuCoordinates(null);

    if (options.isShiftDown || options.isCtrlDown) {
      return;
    }

    if (options.index < 0) {
      setStartIndex(options.index);
      setEndIndex(options.index);
      setSelectedIndexes(new Set());
      return;
    }

    if (options.isMultiSelect) {
      const startIdx = Math.min(startIndex, endIndex);
      const endIdx = Math.max(startIndex, endIndex);
      const isSelectedIndexClick =
        (options.index >= startIdx && options.index <= endIdx) ||
        selectedIndexes.has(options.index);

      if (isSelectedIndexClick) {
        setIsMovingItems(true);
        moveTimeout = setTimeout(() => {
          setStartIndex(options.index);
          setEndIndex(options.index);
          setSelectedIndexes(new Set([options.index]));
          setIsMovingItems(false);
          setIsMouseDown(false);
          setMoveMarkerCoordinates(null);
        }, 200);
        return;
      }
      return;
    }

    const activeIndex = getActiveIndex();
    const isActiveIndexClick = activeIndex === options.index;
    // console.log("isActiveIndexClick", isActiveIndexClick, startIndex, endIndex);
    if (isActiveIndexClick && startIndex === endIndex) {
      setIsMovingItems(true);
      return;
    }

    setStartIndex(options.index);
    setEndIndex(options.index);
    setSelectedIndexes(new Set([options.index]));
  };

  const onMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    const options = resolveMouseOptions(event);
    console.log("mouseup");
    // console.log("mouseup", options);
    // console.log({
    //   startIndex,
    //   endIndex,
    // });
    // console.log("selected", selectedIndexes);
    setPointerStartY(null);
    setIsMouseDown(false);
    setMoveMarkerCoordinates(null);
    console.log("up isMovingItems", isMovingItems);
    if (isMovingItems) {
      const selectedIdx = getSelectedIndexes();
      const selectedItems = getSelectedItems();
      const indexesBelowTarget = selectedIdx.filter((i) => i < options.index);
      const insertIndex = options.index - 1 - indexesBelowTarget.length;

      removeItems();
      dispatch(
        // The playlist head index is 0 => -1
        insertIndex === -1
          ? pasteToPlaylistHead(selectedItems)
          : // and playlist tail is conveniently out of bounds -1 => -2
            insertIndex === -2
            ? pasteToPlaylist(selectedItems, playlist.length - 1)
            : pasteToPlaylist(selectedItems, insertIndex),
      );
      clearSelection();
      setStartIndex(options.index);

      let i =
        // When pasting to tail we have to backtrack the length of the selection
        insertIndex === -2
          ? playlist.length - selectedItems.length
          : insertIndex + 1;
      const condition = i + selectedItems.length;
      const newSelectedIndexes = new Set<number>();
      for (; i < condition; i++) {
        newSelectedIndexes.add(i);
      }
      setSelectedIndexes(newSelectedIndexes);
      return;
    }

    if (options.stopPropagation) {
      return;
    }
    if (options.isContextMenuButtonClick) {
      return;
    }

    if (options.isShiftDown) {
      const startIdx = Math.min(startIndex, options.index);
      const endIdx = Math.max(startIndex, options.index);
      const newSelectedIndexes = new Set<number>();

      for (let i = startIdx; i <= endIdx; i++) {
        newSelectedIndexes.add(i);
      }

      setSelectedIndexes(newSelectedIndexes);
      return;
    }

    if (options.isCtrlDown) {
      setSelectedIndexes(new Set([...selectedIndexes, options.index]));
      return;
    }

    if (options.isMultiSelect) {
      if (options.isRightClick) {
        return;
      }
      if (startIndex === options.index) {
        // Deselect multiselect to one row
        setStartIndex(options.index);
        setEndIndex(options.index);
        setSelectedIndexes(new Set([options.index]));
      }
      return;
    }

    // Must come after multiselect check
    if (options.index < 0) {
      clearSelection();
      return;
    }

    const startIdx = Math.min(startIndex, options.index);
    const endIdx = Math.max(startIndex, options.index);
    const newSelectedIndexes = new Set<number>();
    setStartIndex(startIdx);
    setEndIndex(endIdx);
    for (let i = startIdx; i <= endIdx; i++) {
      newSelectedIndexes.add(i);
    }
    setSelectedIndexes(newSelectedIndexes);
  };

  const onContextMenu = (options: PlaylistItemOptions) => {
    const rect = resolvePlaylistBoundingClientRect();
    const xFudgeFactor = 60;
    const yFudgeFactor = 20;
    setContextMenuCoordinates({
      x: options.clientX - rect.x - xFudgeFactor,
      y: options.clientY - yFudgeFactor,
    });
  };

  const updateEndIndex = (options: PlaylistItemOptions) => {
    if (!isMouseDown || options.index === undefined) {
      return;
    }
    clearTimeout(moveTimeout);
    // console.log("updateEndIndex isMovingItems", isMovingItems);
    if (isMovingItems) {
      const playlistItemIndex = resolvePlaylistItemIndex(options.clientY);
      const y =
        playlistItemIndex === playlist.length - 1 &&
        options.clientY >
          (playlistItemIndex + 1) * playlistItemMaxHeight +
            40 +
            playlistPaddingTop
          ? (playlistItemIndex + 1) * playlistItemMaxHeight + playlistPaddingTop
          : playlistItemIndex * playlistItemMaxHeight + playlistPaddingTop;
      setMoveMarkerCoordinates({ x: options.clientX, y });
      return;
    }

    setStartIndex(startIndex === -1 ? options.index : startIndex);
    setEndIndex(
      startIndex === -1 && options.index === playlist.length - 1
        ? playlist.length - 1
        : options.index,
    );

    const isPointerStartYOverBound =
      pointerStartY &&
      pointerStartY >
        playlistRowsStartY + playlistItemMaxHeight * playlist.length;
    const isPointerStartYUnderBound =
      pointerStartY && pointerStartY < playlistRowsStartY;
    const isClientYOverBound =
      options.clientY >
      playlistRowsStartY + playlistItemMaxHeight * playlist.length - 10;
    const isClientYUnderBound = options.clientY < playlistRowsStartY + 10;

    if (
      (isClientYOverBound && isPointerStartYOverBound) ||
      (isClientYUnderBound && isPointerStartYUnderBound)
    ) {
      setSelectedIndexes(new Set());
    } else if (options.index > -1) {
      const startIdx = Math.min(startIndex, options.index);
      const endIdx = Math.max(startIndex, options.index);
      const newSelectedIndexes = new Set<number>();

      let i = startIndex === -1 ? endIdx : startIdx;
      for (; i <= endIdx; i++) {
        if (i > -1 && i < playlist.length) {
          newSelectedIndexes.add(i);
        }
      }
      setSelectedIndexes(newSelectedIndexes);
    }
  };

  const onMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    updateEndIndex({
      index: resolvePlaylistItemIndex(event.clientY),
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  // Side-effect handlers

  const scroll = () => {
    setHideOverflow(true);
    playlistRef.current &&
      playlistRef.current.scrollTo({
        top: playlistRef.current.scrollTop + 300,
        behavior: "smooth",
      });
    setTimeout(() => setHideOverflow(false), 500);
  };

  const handleOpenEditor = (mode: EditorMode) => {
    console.log("handleOpenEditor");
    const files = getSelectedItems();
    const activeIndex = getActiveIndex();
    const filesIndex =
      mode === "metadata"
        ? files.findIndex((file) => file === playlist[activeIndex])
        : -1;

    toggleModal(mode, filesIndex, files);
    setContextMenuCoordinates(null);
  };

  if (playlist.length < 1) {
    return (
      <Instructions isSmall={isSmall}>
        <InstructionsWrapper>
          <p>{t("playlist.instructions.title")}</p>
          <ControlsInstructions>
            <ControlsHeader>
              {t("playlist.instructions.playControls")}
            </ControlsHeader>
            <ControlsInstruction>
              <div>{t("playlist.instructions.playPause")}</div>
              <div>{t("playlist.instructions.spacebar")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.mute")}</div>
              <div>M</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.toggleSearch")}</div>
              <div>Ctrl / Cmd + Shift + F</div>
            </ControlsInstruction>

            <ControlsHeader>
              {t("playlist.instructions.playlistControls")}
            </ControlsHeader>
            <ControlsInstruction>
              <div>{t("playlist.instructions.playReplay")}</div>
              <div>Enter</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.select")}</div>
              <div>{t("playlist.instructions.clickAndDrag")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.selectAll")}</div>
              <div>Ctrl / Cmd + A</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.cut")}</div>
              <div>Ctrl / Cmd + X</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.copy")}</div>
              <div>Ctrl / Cmd + C</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.paste")}</div>
              <div>Ctrl / Cmd + V</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.remove")}</div>
              <div>{t("playlist.instructions.backspaceOrDelete")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.duplicateSelection")}</div>
              <div>Ctrl / Cmd + Shift + D</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.moveItemWithPointer")}</div>
              <div>{t("playlist.instructions.longPress")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.moveUp")}</div>
              <div>{t("playlist.instructions.upArrow")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.moveDown")}</div>
              <div>{t("playlist.instructions.downArrow")}</div>
            </ControlsInstruction>

            <ControlsHeader>
              {t("playlist.instructions.touchControls")}
            </ControlsHeader>
            <ControlsInstruction>
              <div>{t("playlist.instructions.playReplay")}</div>
              <div>{t("playlist.instructions.doubleTap")}</div>
            </ControlsInstruction>
            <ControlsInstruction>
              <div>{t("playlist.instructions.addFromLibrary")}</div>
              <div>{t("playlist.instructions.longPress")}</div>
            </ControlsInstruction>
          </ControlsInstructions>
        </InstructionsWrapper>
      </Instructions>
    );
  }

  return (
    <Container
      ref={playlistRef}
      isSmall={isSmall}
      className={playlistClassName}
      hideOverflow={hideOverflow}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseOver}
      data-testid="PlaylistContainer"
    >
      {moveMarkerCoordinates && (
        <MoveMarker coordinates={moveMarkerCoordinates} />
      )}
      {contextMenuCoordinates && (
        <ContextMenu
          coordinates={contextMenuCoordinates}
          openEditor={handleOpenEditor}
        />
      )}
      {playlist.map(
        (item, index) =>
          item && (
            <PlaylistItem
              key={`${item.name}-${index}`}
              item={item}
              index={index}
              isSelected={selectedIndexes.has(index)}
              isMovingItems={isMovingItems}
              onDoubleClick={playOrReplay}
              onContextMenu={onContextMenu}
              onScrollPlaylist={scroll}
              removeItems={removeItems}
            />
          ),
      )}
    </Container>
  );
};

export default connect(
  (state: { player: PlayerState; settings: SettingsState }) => ({
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    t: state.settings.t,
  }),
)(Playlist);
