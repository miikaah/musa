import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  playlistItemContextMenuClassName,
  playlistItemMaxHeight,
} from "./PlaylistItem";
import ContextMenu, {
  ContextMenuCoordinates,
  contextMenuId,
} from "../ContextMenu";
import { AudioItem, EditorMode } from "../../types";

const titleBarHeight = 36;
const playlistPaddingTop = 14;
export const playlistRowsStartY = titleBarHeight + playlistPaddingTop;

const commonCss = css<{ isSmall: boolean }>`
  padding: ${playlistPaddingTop}px 0 100px;
  margin: 0;
  border: 0 solid var(--color-primary-highlight);
  border-left-width: 1px;
  border-right-width: 3px;
  background-color: var(--color-bg);
  max-height: 89vh;
  max-width: ${({ isSmall }) => (isSmall ? "600px" : "10000px")};
`;

const Container = styled.ul<{ isSmall: boolean }>`
  ${commonCss}
  ${listOverflow}
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

const Icon = styled.span<{ index: number; isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  position: absolute;
  left: 0;
  top: ${({ index }) =>
    (index < 0 ? -100 : index * playlistItemMaxHeight) +
    playlistRowsStartY -
    15}px;

  ${({ isSelected }) => isSelected && `color: var(--color-typography-primary);`}
`;

const playlistClassName = "playlist";

type MouseUpDownOptions = {
  index: number;
  isShiftDown: boolean;
  isCtrlDown: boolean;
  isMultiSelect: boolean;
  isRightClick: boolean;
  isContextMenuButtonClick: boolean;
  isContextMenuItemClick: boolean;
};

type PlaylistProps = {
  playlist: PlayerState["items"];
  currentItem: PlayerState["currentItem"];
  currentIndex: PlayerState["currentIndex"];
  isPlaying: PlayerState["isPlaying"];
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
  isPlaying,
  toggleModal,
  t,
}: PlaylistProps) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoints.lg);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [pointerStartY, setPointerStartY] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(-1);
  const [endIndex, setEndIndex] = useState(-1);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    new Set(),
  );
  const [clipboard, setClipboard] = useState<AudioItem[]>([]);
  const [contextMenuCoordinates, setContextMenuCoordinates] =
    useState<ContextMenuCoordinates | null>(null);
  const [moveMarkerCoordinates, setMoveMarkerCoordinates] =
    useState<MoveMarkerCoordinates | null>(null);
  const dispatch = useDispatch();

  const playlistRef = useRef<HTMLUListElement | null>(null);
  const isMouseDown = useRef(false);
  const isMovingItems = useRef(false);
  const pStartY = useRef(0);
  const scrollIntervalRef = useRef<number | null>(null);
  const speedIncreaseIntervalRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(5);

  useEffect(() => {
    const onResize = () => {
      setIsSmall(window.innerWidth < breakpoints.lg);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onDocumentMouseUp = (event: MouseEvent) => {
      if (isMouseDown.current) {
        onMouseUp(event as unknown as React.MouseEvent<HTMLElement>);
      }
    };
    document.addEventListener("mouseup", onDocumentMouseUp);

    const onDocumentMouseMove = (event: MouseEvent) => {
      if (isMouseDown.current) {
        onMouseMove(event as unknown as React.MouseEvent<HTMLElement>);
      }
    };
    document.addEventListener("mousemove", onDocumentMouseMove);

    return () => {
      document.removeEventListener("mouseup", onDocumentMouseUp);
      document.removeEventListener("mousemove", onDocumentMouseMove);
    };
  }, [playlist, startIndex]);

  useEffect(() => {
    const playlistItemEl = document.getElementById(currentItem?.id ?? "");
    if (!playlistItemEl) {
      return;
    }
    const elRect = playlistItemEl.getBoundingClientRect();
    if (elRect.bottom > window.innerHeight - 1) {
      playlistItemEl.scrollIntoView(false); // Scrolls to correct song
      scroll(); // Scrolls a little bit down so current song isn't at bottom of view
    }
  }, [currentItem]);

  const getSelectedIndexes = () => {
    return Array.from(selectedIndexes.values()).sort((a, b) => a - b);
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

  const resolveIndexes = (event: KeyboardEvent, newIndex: number) => {
    if (event.shiftKey) {
      const startIdx = Math.min(startIndex, newIndex);
      const endIdx = Math.max(startIndex, newIndex);
      const newSelectedIndexes = new Set<number>();
      for (let i = startIdx; i <= endIdx; i++) {
        newSelectedIndexes.add(i);
      }
      setSelectedIndexes(newSelectedIndexes);
      setEndIndex(newIndex);
      // Start index is not updated when making a multiselection with keyboard
    } else {
      setSelectedIndexes(new Set([newIndex]));
      setStartIndex(newIndex);
      setEndIndex(newIndex);
    }
  };

  const moveUp = (event: KeyboardEvent) => {
    event.preventDefault();
    const newIndex = endIndex > 0 ? endIndex - 1 : playlist.length - 1;
    resolveIndexes(event, newIndex);
  };
  useKeyPress(KEYS.Up, moveUp);

  const moveDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const newIndex = endIndex + 1 < playlist.length ? endIndex + 1 : 0;
    resolveIndexes(event, newIndex);
  };
  useKeyPress(KEYS.Down, moveDown);

  const playOrReplay = (aIndex?: number) => {
    const activeIndex = aIndex ?? getActiveIndex();
    const shouldReplay =
      activeIndex === currentIndex &&
      isEqual(currentItem, playlist[activeIndex]);

    if (shouldReplay) {
      dispatch(replay(true));
    } else {
      dispatch(playIndex(activeIndex));
    }
  };
  useKeyPress(KEYS.Enter, () => playOrReplay());

  const removeItems = () => {
    setClipboard(getSelectedItems());
    if (selectedIndexes.size > 0) {
      dispatch(removeIndexesFromPlaylist(getSelectedIndexes()));
    } else if (startIndex < playlist.length) {
      dispatch(removeIndexesFromPlaylist([startIndex]));
    }
    setSelectedIndexes(new Set());
  };

  const removeItemsAndMoveDown = () => {
    removeItems();
    setStartIndex(startIndex);
    setEndIndex(startIndex);
    if (startIndex < playlist.length - 1) {
      setSelectedIndexes(new Set([startIndex]));
    }
  };
  useKeyPress(KEYS.Backspace, removeItemsAndMoveDown);
  useKeyPress(KEYS.Delete, removeItemsAndMoveDown);

  const cut = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    removeItemsAndMoveDown();
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

  const resolveTrueClientY = (clientY: number) => {
    const playlistScrollTop = playlistRef.current?.scrollTop ?? 0;
    return clientY + playlistScrollTop;
  };

  const resolvePlaylistItemIndex = (clientY: number) => {
    const rect = resolvePlaylistBoundingClientRect();
    const y = resolveTrueClientY(clientY) - rect.y - playlistPaddingTop + 1;
    const index = Math.trunc(y / playlistItemMaxHeight);
    const playlistItemIndex = Object.is(index, -0)
      ? 0
      : index > playlist.length
        ? playlist.length
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
    const trueClientY = resolveTrueClientY(clientY);
    return (
      trueClientY < playlistRowsStartY ||
      trueClientY > playlistRowsStartY + playlistItemMaxHeight * playlist.length
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
    const id = playlistItemContextMenuClassName;
    const target = event.target as HTMLElement;
    const isContextMenuButtonClick =
      (typeof target?.className === "string"
        ? (target?.className ?? "")
        : ""
      ).includes(id) ||
      (typeof target?.parentElement?.className === "string"
        ? (target.parentElement?.className ?? "")
        : ""
      ).includes(id) ||
      false;

    return {
      index: newIndex,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey,
      isMultiSelect: selectedIndexes.size > 1 && selectedIndexes.has(newIndex),
      isRightClick: event.button === 2,
      isContextMenuButtonClick,
      isContextMenuItemClick,
    };
  };

  const clearSelection = () => {
    isMouseDown.current = false;
    isMovingItems.current = false;
    setStartIndex(-1);
    setEndIndex(-1);
    setSelectedIndexes(new Set());
    setContextMenuCoordinates(null);
    setMoveMarkerCoordinates(null);
  };

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    isMouseDown.current = true;
    isMovingItems.current = false;
    pStartY.current = event.clientY;
    const options = resolveMouseOptions(event);
    setStartIndex(options.index);
    setPointerStartX(event.clientX);
    setPointerStartY(event.clientY);
    setMoveMarkerCoordinates(null);

    if (options.isContextMenuItemClick) {
      return;
    }

    if (options.isContextMenuButtonClick) {
      if (selectedIndexes.size < 1) {
        setStartIndex(options.index);
        setEndIndex(options.index);
        setSelectedIndexes(new Set([options.index]));
      }
      return;
    }

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
      if (options.isRightClick || contextMenuCoordinates) {
        return;
      }
      const startIdx = Math.min(startIndex, endIndex);
      const endIdx = Math.max(startIndex, endIndex);
      const isSelectedIndexClick =
        (options.index >= startIdx && options.index <= endIdx) ||
        selectedIndexes.has(options.index);

      if (isSelectedIndexClick) {
        isMovingItems.current = true;
        return;
      }
      return;
    }

    const activeIndex = getActiveIndex();
    const isActiveIndexClick = activeIndex === options.index;
    if (
      isActiveIndexClick &&
      startIndex === endIndex &&
      !options.isRightClick
    ) {
      isMovingItems.current = true;
      return;
    }

    setEndIndex(options.index);
    setSelectedIndexes(new Set([options.index]));
  };

  const onMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    stopScrolling();
    isMouseDown.current = false;
    const options = resolveMouseOptions(event);
    setPointerStartX(null);
    setPointerStartY(null);
    setMoveMarkerCoordinates(null);

    if (isMovingItems.current) {
      setContextMenuCoordinates(null);
      if (pointerStartX === event.clientX && pointerStartY === event.clientY) {
        // Deselect to one row
        setStartIndex(options.index);
        setEndIndex(options.index);
        setSelectedIndexes(new Set([options.index]));
        // IMPORTANT: Bug fix on Linux where double clicking on a row to start playing it
        //            sets isMoving to true and when clicking on sound menu in the tray
        //            and changing the volume, causes an extra mouseup event to be fired
        //            when next time clicking on the playlist, which causes mouse move ops
        //            to fire, moving the selected track to the end of the playlist.
        //            Setting isMoving to false here fixes the issue.
        isMovingItems.current = false;
        return;
      }
      const selectedIdx = getSelectedIndexes();
      const selectedItems = getSelectedItems();
      const indexesBelowTarget = selectedIdx.filter((i) => i < options.index);
      const isClientYUnderBound = event.clientY < playlistRowsStartY;
      const insertIndex =
        options.index -
        1 -
        indexesBelowTarget.length +
        (isClientYUnderBound ? 1 : 0);

      removeItems();
      dispatch(
        // The playlist head index is 0 => -1
        // and playlist tail is conveniently out of bounds -1 => -2
        insertIndex === -2
          ? pasteToPlaylist(selectedItems, playlist.length - 1)
          : pasteToPlaylist(selectedItems, insertIndex),
      );
      clearSelection();

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
      const arr = Array.from(newSelectedIndexes.values()).sort((a, b) => a - b);
      setStartIndex(arr[0]);
      setEndIndex(arr[arr.length - 1]);
      setSelectedIndexes(newSelectedIndexes);
      return;
    }
    isMovingItems.current = false;

    if (options.isContextMenuItemClick) {
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
      setContextMenuCoordinates(null);
      return;
    }

    if (options.isCtrlDown) {
      if (selectedIndexes.has(options.index)) {
        setSelectedIndexes(
          new Set([...selectedIndexes].filter((i) => i !== options.index)),
        );
      } else {
        setSelectedIndexes(new Set([...selectedIndexes, options.index]));
      }
      setContextMenuCoordinates(null);
      return;
    }

    if (options.isMultiSelect) {
      if (options.isRightClick) {
        return;
      }
      setContextMenuCoordinates(null);
      if (resolvePlaylistItemIndex(pStartY.current) === options.index) {
        // Deselect multiselect to one row
        setStartIndex(options.index);
        setEndIndex(options.index);
        setSelectedIndexes(new Set([options.index]));
      }
      return;
    }

    // Must come after multiselect check
    if (options.isRightClick) {
      return;
    }

    const isPointerStartYUnderBound =
      pointerStartY && pointerStartY < playlistRowsStartY;
    const isPointerStartYOverBound =
      pointerStartY &&
      pointerStartY >
        playlistRowsStartY + playlistItemMaxHeight * playlist.length;
    if (
      options.index < 0 &&
      selectedIndexes.size < playlist.length &&
      (isPointerStartYUnderBound || isPointerStartYOverBound)
    ) {
      clearSelection();
      return;
    }
    setContextMenuCoordinates(null);
  };

  const openContextMenu = (options: PlaylistItemOptions) => {
    const rect = resolvePlaylistBoundingClientRect();
    const dx = 110;
    const x2 = options.clientX - rect.x;
    const x3 = rect.right - rect.x - dx;
    const isXUnderLeftBound = x2 < 66;
    const isXOverRightBound = x2 > x3;
    const x = isXUnderLeftBound ? 8 : isXOverRightBound ? x3 - 56 : x2 - 60;
    const y = resolveTrueClientY(options.clientY) - 20;

    setContextMenuCoordinates({ x, y });
  };

  const startScrolling = (direction: "up" | "down") => {
    if (scrollIntervalRef.current) return;

    scrollIntervalRef.current = window.setInterval(() => {
      if (playlistRef.current) {
        if (direction === "up") {
          playlistRef.current.scrollBy({ top: -scrollSpeedRef.current });
        } else if (direction === "down") {
          playlistRef.current.scrollBy({ top: scrollSpeedRef.current });
        }
      }
    }, 27);

    speedIncreaseIntervalRef.current = window.setInterval(() => {
      scrollSpeedRef.current = Math.min(scrollSpeedRef.current + 1, 27);
    }, 27);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      window.clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    if (speedIncreaseIntervalRef.current) {
      window.clearInterval(speedIncreaseIntervalRef.current);
      speedIncreaseIntervalRef.current = null;
    }
    scrollSpeedRef.current = 5;
  };

  const scrollIfNecessary = (options: PlaylistItemOptions) => {
    const { top, bottom } = resolvePlaylistBoundingClientRect();

    if (options.clientY < top + 150) {
      startScrolling("up");
    } else if (options.clientY > bottom - 150) {
      startScrolling("down");
    } else {
      stopScrolling();
    }
  };

  const updateEndIndex = (options: PlaylistItemOptions & { index: number }) => {
    if (!isMouseDown.current || contextMenuCoordinates) {
      return;
    }
    if (isMovingItems.current) {
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

    const isPointerStartYUnderBound =
      pointerStartY && pointerStartY < playlistRowsStartY;
    const isPointerStartYOverBound =
      pointerStartY &&
      pointerStartY >
        playlistRowsStartY + playlistItemMaxHeight * playlist.length;
    const isClientYUnderBound = options.clientY < playlistRowsStartY + 10;
    const isClientYOverBound =
      options.clientY >
      playlistRowsStartY + playlistItemMaxHeight * playlist.length - 10;

    if (
      (isClientYUnderBound && isPointerStartYUnderBound) ||
      (isClientYOverBound && isPointerStartYOverBound)
    ) {
      setSelectedIndexes(new Set());
    } else if (options.index > -1) {
      const eIdx = resolvePlaylistItemIndex(options.clientY);
      const startIdx = Math.min(startIndex, eIdx);
      const endIdx = Math.max(startIndex, eIdx);
      const newSelectedIndexes = new Set<number>();

      for (let i = startIdx; i <= endIdx; i++) {
        if (i > -1 && i < playlist.length) {
          newSelectedIndexes.add(i);
        }
      }
      setSelectedIndexes(newSelectedIndexes);
      scrollIfNecessary(options);
    }
  };

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    updateEndIndex({
      index: resolvePlaylistItemIndex(event.clientY),
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  // Side-effect handlers

  const scroll = () => {
    playlistRef.current &&
      playlistRef.current.scrollTo({
        top: playlistRef.current.scrollTop + 400,
        behavior: "smooth",
      });
  };

  const getUniqueItems = (items: PlaylistProps["playlist"]) => {
    const uniq = new Map();
    for (const item of items) {
      uniq.set(item.fileUrl, item);
    }
    return Array.from(uniq.values());
  };

  const handleOpenEditor = (mode: EditorMode) => {
    const items = getSelectedItems();
    const uniqueItems = getUniqueItems(items);
    const filesIndex =
      mode === "metadata"
        ? uniqueItems.findIndex(
            (file) => file.fileUrl === playlist[getActiveIndex()].fileUrl,
          )
        : -1;

    toggleModal(mode, filesIndex, uniqueItems);
    setContextMenuCoordinates(null);
  };

  const handlePlayOrReplay = (options: PlaylistItemOptions) => {
    playOrReplay(resolvePlaylistItemIndex(options.clientY));
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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      data-testid="PlaylistContainer"
    >
      <Icon index={currentIndex} isSelected={selectedIndexes.has(currentIndex)}>
        {isPlaying ? (
          <FontAwesomeIcon icon="play" data-testid="PlaylistItemPlayIcon" />
        ) : (
          <FontAwesomeIcon icon="pause" data-testid="PlaylistItemPauseIcon" />
        )}
      </Icon>
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
              key={item.id}
              item={item}
              isSelected={selectedIndexes.has(index)}
              onDoubleClick={handlePlayOrReplay}
              onContextMenu={openContextMenu}
              onScrollPlaylist={scroll}
              onRemoveItems={removeItems}
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
    isPlaying: state.player.isPlaying,
    t: state.settings.t,
  }),
)(Playlist);
