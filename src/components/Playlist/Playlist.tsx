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
import PlaylistItem, { MouseUpDownOptions } from "./PlaylistItem";

const commonCss = css<{ isSmall: boolean }>`
  padding: 14px 0;
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

const PLAYLIST_CLASSNAME = "playlist";

type PlaylistProps = {
  playlist: PlayerState["items"];
  currentItem: PlayerState["currentItem"];
  currentIndex: PlayerState["currentIndex"];
  toggleModal: (items: AudioWithMetadata[]) => void;
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
  const [pressStartedAt, setPressStartedAt] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [startIndex, setStartIndex] = useState(NaN);
  const [endIndex, setEndIndex] = useState(NaN);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    new Set(),
  );
  const [clipboard, setClipboard] = useState<AudioWithMetadata[]>([]);
  const [hideOverflow, setHideOverflow] = useState(false);
  const dispatch = useDispatch();

  const ref = useRef<HTMLUListElement | null>(null);

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

  const isContinuousSelection = () => {
    return (
      !Number.isNaN(startIndex) &&
      !Number.isNaN(endIndex) &&
      startIndex !== endIndex &&
      selectedIndexes.size < 2
    );
  };

  const getContinuousSelData = (getSelected?: boolean) => {
    const sIndex = Math.min(startIndex, endIndex);
    const eIndex = Math.max(startIndex, endIndex);
    const selectedItems = getSelected
      ? playlist.filter((_, index) => index >= sIndex && index <= eIndex)
      : clipboard;
    const indexes = [];

    for (let i = sIndex; i <= eIndex; i++) {
      indexes.push(i);
    }

    return { indexes, selectedItems };
  };

  const handleContinuousSelection = ({
    type,
    getSelected = true,
  }: {
    type: "remove" | "copy" | "duplicate";
    getSelected?: boolean;
  }) => {
    const { indexes, selectedItems } = getContinuousSelData(getSelected);

    switch (type) {
      case "remove": {
        dispatch(removeIndexesFromPlaylist(indexes));
        setSelectedIndexes(new Set());
        setStartIndex(NaN);
        setEndIndex(NaN);
        setClipboard(selectedItems);
        setActiveIndex(-1);
        return;
      }

      case "duplicate": {
        dispatch(pasteToPlaylist(selectedItems, activeIndex));
        return;
      }

      default: {
        setClipboard(selectedItems);
      }
    }
  };

  const isIndexesSelection = () => {
    return activeIndex > -1 || selectedIndexes.size > 0;
  };

  const getIndexesSelData = (getSelected?: boolean) => {
    const indexes =
      selectedIndexes.size > 0
        ? Array.from(selectedIndexes.values())
        : [activeIndex];
    const selectedItems = getSelected
      ? indexes.map((i) => playlist[i])
      : clipboard;
    return { indexes, selectedItems };
  };

  const handleIndexesSelection = ({
    type,
    getSelected = true,
  }: {
    type: "remove" | "copy" | "duplicate";
    getSelected?: boolean;
  }) => {
    const { indexes, selectedItems } = getIndexesSelData(getSelected);

    switch (type) {
      case "remove": {
        dispatch(removeIndexesFromPlaylist(indexes));
        setSelectedIndexes(new Set());
        setStartIndex(NaN);
        setEndIndex(NaN);
        setClipboard(selectedItems);
        setActiveIndex(selectedIndexes.size > 1 ? -1 : activeIndex);
        return;
      }

      case "duplicate": {
        dispatch(pasteToPlaylist(selectedItems, activeIndex));
        return;
      }

      default: {
        setClipboard(selectedItems);
      }
    }
  };

  const setNewIndexes = (event: KeyboardEvent, newActiveIndex: number) => {
    if (event.shiftKey) {
      setStartIndex(!Number.isNaN(startIndex) ? startIndex : activeIndex);
      setEndIndex(newActiveIndex);
      setActiveIndex(newActiveIndex);
      return;
    }
    setStartIndex(NaN);
    setEndIndex(NaN);
    setActiveIndex(newActiveIndex);
    setSelectedIndexes(new Set());
  };

  const selectAll = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    setStartIndex(0);
    setEndIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.a, selectAll);

  const moveUp = (event: KeyboardEvent) => {
    event.preventDefault();
    if (activeIndex - 1 > -1) return setNewIndexes(event, activeIndex - 1);
    if (playlist.length) return setActiveIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.Up, moveUp);

  const moveDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (activeIndex + 1 < playlist.length)
      return setNewIndexes(event, activeIndex + 1);
    if (playlist.length) return setActiveIndex(0);
  };
  useKeyPress(KEYS.Down, moveDown);

  const shouldReplaySong = () => {
    if (
      activeIndex === currentIndex &&
      isEqual(currentItem, playlist[activeIndex])
    ) {
      return true;
    }

    if (isIndexesSelection()) {
      const idx = Math.min(...Array.from(selectedIndexes.values()));

      return idx === currentIndex && isEqual(currentItem, playlist[idx]);
    }

    if (isContinuousSelection()) {
      const idx = Math.min(startIndex, endIndex);

      return idx === currentIndex && isEqual(currentItem, playlist[idx]);
    }

    return false;
  };

  const playOrReplayActiveItem = () => {
    if (shouldReplaySong()) {
      dispatch(replay(true));
      return;
    }

    const indices = [activeIndex, startIndex, endIndex].filter(
      (idx) => typeof idx === "number" && isFinite(idx) && idx > -1,
    );

    dispatch(
      playIndex(Math.min(...indices, ...Array.from(selectedIndexes.values()))),
    );
  };
  useKeyPress(KEYS.Enter, playOrReplayActiveItem);

  const removeItems = () => {
    if (isContinuousSelection()) {
      handleContinuousSelection({
        type: "remove",
        getSelected: false,
      });
      return;
    }
    if (isIndexesSelection()) {
      handleIndexesSelection({ type: "remove", getSelected: false });
      return;
    }
  };
  useKeyPress(KEYS.Backspace, removeItems);
  useKeyPress(KEYS.Delete, removeItems);

  const cut = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    if (isContinuousSelection()) {
      handleContinuousSelection({ type: "remove" });
      return;
    }
    if (isIndexesSelection()) {
      handleIndexesSelection({ type: "remove" });
      return;
    }
  };
  useKeyPress(KEYS.x, cut);

  const copy = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    if (isContinuousSelection()) {
      handleContinuousSelection({ type: "copy" });
      return;
    }
    if (isIndexesSelection()) {
      handleIndexesSelection({ type: "copy" });
      return;
    }
  };
  useKeyPress(KEYS.c, copy);

  const duplicate = (event: KeyboardEvent) => {
    if (!isCtrlDown(event) || !event.shiftKey) return;
    if (isContinuousSelection()) {
      handleContinuousSelection({ type: "duplicate" });
      event.preventDefault();
      return;
    }
    if (isIndexesSelection()) {
      handleIndexesSelection({ type: "duplicate" });
      event.preventDefault();
      return;
    }
  };
  useKeyPress(KEYS.d, duplicate);
  useKeyPress(KEYS.D, duplicate);

  const paste = (event: KeyboardEvent) => {
    if (!isCtrlDown(event)) return;
    dispatch(
      pasteToPlaylist(
        clipboard,
        activeIndex < 0 ? playlist.length : activeIndex,
      ),
    );
  };
  useKeyPress(KEYS.v, paste);

  const updateEndIndex = (endIndex: number) => {
    if (!isMouseDown) return;
    setEndIndex(endIndex);
  };

  const onMouseDown = (options: MouseUpDownOptions) => {
    if (options.isShiftDown || options.isCtrlDown) return;

    if (isMovingItems) {
      setIsMouseDown(false);
      setIsMovingItems(false);
      setStartIndex(NaN);
      setEndIndex(NaN);
      setActiveIndex(options.index);
      setSelectedIndexes(new Set());

      const selectedItem = playlist[startIndex];
      dispatch(removeIndexesFromPlaylist([startIndex]));
      dispatch(pasteToPlaylist([selectedItem], options.index - 1));
      return;
    }

    setIsMouseDown(true);
    setStartIndex(options.index);
    setEndIndex(options.index);
    setActiveIndex(options.index);
    setSelectedIndexes(new Set([options.index]));
    setPressStartedAt(Date.now());
  };

  const onMouseUp = (options: MouseUpDownOptions) => {
    const isLongPressOnItem =
      Date.now() - pressStartedAt > 500 && startIndex === options.index;
    setPressStartedAt(0);
    if (isLongPressOnItem) {
      setIsMovingItems(true);
      setIsMouseDown(false);
      return;
    }
    if (options.isCtrlDown) {
      setIsMouseDown(false);
      setActiveIndex(-1);
      setSelectedIndexes(new Set([...selectedIndexes, options.index]));
      return;
    }
    setIsMouseDown(false);
    setStartIndex(startIndex);
    setEndIndex(options.index);
  };

  const clearSelection = (event: React.MouseEvent<HTMLUListElement>) => {
    if (startIndex === endIndex && !event.shiftKey) {
      setIsMouseDown(false);
      setActiveIndex(-1);
      setEndIndex(NaN);
      setSelectedIndexes(new Set());
    } else {
      setIsMouseDown(false);
      setActiveIndex(-1);
    }
  };

  const scroll = () => {
    setHideOverflow(true);
    ref.current &&
      ref.current.scrollTo({
        top: ref.current.scrollTop + 300,
        behavior: "smooth",
      });
    setTimeout(() => setHideOverflow(false), 500);
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
      ref={ref}
      isSmall={isSmall}
      className={PLAYLIST_CLASSNAME}
      onMouseDown={(event: React.MouseEvent<HTMLUListElement>) => {
        onMouseDown({
          index:
            (event.target as HTMLElement).className === PLAYLIST_CLASSNAME
              ? playlist.length - 1
              : 0,
          isShiftDown: event.shiftKey,
          isCtrlDown: false,
        });
      }}
      onMouseUp={clearSelection}
      hideOverflow={hideOverflow}
      data-testid="PlaylistContainer"
    >
      {playlist.map(
        (item, index) =>
          item && (
            <PlaylistItem
              key={`${item.name}-${index}`}
              item={item}
              index={index}
              activeIndex={activeIndex}
              startIndex={startIndex}
              endIndex={endIndex}
              onSetActiveIndex={setActiveIndex}
              isSelected={selectedIndexes.has(index)}
              onMouseOverItem={updateEndIndex}
              onMouseDownItem={onMouseDown}
              onMouseUpItem={onMouseUp}
              onScrollPlaylist={scroll}
              toggleModal={toggleModal}
              removeItems={removeItems}
              isMovingItems={isMovingItems}
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
