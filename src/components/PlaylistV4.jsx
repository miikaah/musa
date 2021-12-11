import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import isEqual from "lodash.isequal";
import styled, { css } from "styled-components/macro";
import {
  pasteToPlaylist,
  removeRangeFromPlaylist,
  removeIndexesFromPlaylist,
  emptyPlaylist,
  playIndex,
  replay,
} from "reducers/player.reducer";
import { KEYS, isCtrlDown } from "../util";
import { useKeyPress } from "../hooks";
import PlaylistItem from "./PlaylistItemV3";
import { listOverflow } from "../common.styles";

const commonCss = css`
  padding: 14px 0;
  margin: 0;
  border: 0 solid var(--color-primary-highlight);
  border-left-width: 1px;
  border-right-width: 3px;
  background-color: var(--color-bg);
  max-height: 89vh;
  flex: 60%;
`;

const Container = styled.ul`
  ${commonCss}
  ${listOverflow}
  overflow-y: ${({ hideOverflow }) => (hideOverflow ? "hidden" : "auto")};
  overflow-x: hidden;
`;

const Instructions = styled.div`
  ${commonCss}
  ${listOverflow}
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    opacity: 0.3666;
    margin-bottom: 16px;
  }
`;

const PLAYLIST_CLASSNAME = "playlist";

const Playlist = ({
  onScrollPlaylist,
  playlist,
  currentItem,
  currentIndex,
  dispatch,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [startIndex, setStartIndex] = useState(NaN);
  const [endIndex, setEndIndex] = useState(NaN);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  const [hideOverflow, setHideOverflow] = useState(false);

  const ref = useRef(null);

  const isContinuousSelection = () => {
    return (
      !Number.isNaN(startIndex) &&
      !Number.isNaN(endIndex) &&
      startIndex !== endIndex &&
      selectedIndexes.size < 2
    );
  };

  const getContinuousSelData = (getSelected) => {
    const sIndex = Math.min(startIndex, endIndex);
    const eIndex = Math.max(startIndex, endIndex);
    const selectedItems = getSelected
      ? playlist.filter((_, index) => index >= sIndex && index <= eIndex)
      : clipboard;
    return { startIndex: sIndex, endIndex: eIndex, selectedItems };
  };

  const handleContinuousSelection = ({ type, getSelected = true }) => {
    const { startIndex, endIndex, selectedItems } =
      getContinuousSelData(getSelected);

    switch (type) {
      case "remove": {
        dispatch(removeRangeFromPlaylist(startIndex, endIndex));
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

  const getIndexesSelData = (getSelected) => {
    const indexes =
      selectedIndexes.size > 0
        ? Array.from(selectedIndexes.values())
        : [activeIndex];
    const selectedItems = getSelected
      ? indexes.map((i) => playlist[i])
      : clipboard;
    return { indexes, selectedItems };
  };

  const handleIndexesSelection = ({ type, getSelected = true }) => {
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

  const shouldReplaySong = () => {
    return (
      activeIndex === currentIndex &&
      isEqual(currentItem, playlist[activeIndex])
    );
  };

  const setNewIndexes = (event, newActiveIndex) => {
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

  const selectAll = (event) => {
    if (!isCtrlDown(event)) return;
    setStartIndex(0);
    setEndIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.A, selectAll);

  const moveUp = (event) => {
    event.preventDefault();
    if (activeIndex - 1 > -1) return setNewIndexes(event, activeIndex - 1);
    if (playlist.length) return setActiveIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.Up, moveUp);

  const moveDown = (event) => {
    event.preventDefault();
    if (activeIndex + 1 < playlist.length)
      return setNewIndexes(event, activeIndex + 1);
    if (playlist.length) return setActiveIndex(0);
  };
  useKeyPress(KEYS.Down, moveDown);

  const createNewPlaylistFromSelection = () => {
    if (isContinuousSelection() || selectedIndexes.size > 1) {
      let selItems;
      if (isContinuousSelection()) {
        const { selectedItems } = getContinuousSelData(true);
        selItems = selectedItems;
      }
      if (selectedIndexes.size > 1) {
        const { selectedItems } = getIndexesSelData(true);
        selItems = selectedItems;
      }

      dispatch(emptyPlaylist());
      dispatch(pasteToPlaylist(selItems, 0));
      setStartIndex(NaN);
      setEndIndex(NaN);
      setActiveIndex(0);
      return;
    }

    // PLAY OR REPLAY ACTIVE ITEM
    if (activeIndex < 0) return;
    if (shouldReplaySong()) {
      dispatch(replay(true));
      return;
    }
    dispatch(playIndex(activeIndex));
  };
  useKeyPress(KEYS.Enter, createNewPlaylistFromSelection);

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

  const cut = (event) => {
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
  useKeyPress(KEYS.X, cut);

  const copy = (event) => {
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
  useKeyPress(KEYS.C, copy);

  const duplicate = (event) => {
    if (!isCtrlDown(event) || !event.shiftKey) return;
    if (isContinuousSelection()) {
      handleContinuousSelection({ type: "duplicate" });
      return;
    }
    if (isIndexesSelection()) {
      handleIndexesSelection({ type: "duplicate" });
      return;
    }
  };
  useKeyPress(KEYS.D, duplicate);

  const paste = (event) => {
    if (!isCtrlDown(event)) return;
    dispatch(
      pasteToPlaylist(
        clipboard,
        activeIndex < 0 ? playlist.length : activeIndex
      )
    );
  };
  useKeyPress(KEYS.V, paste);

  const updateEndIndex = (endIndex) => {
    if (!isMouseDown) return;
    setEndIndex(endIndex);
  };

  const onMouseDown = (options) => {
    if (options.isShiftDown || options.isCtrlDown) return;
    setIsMouseDown(true);
    setStartIndex(options.index);
    setEndIndex(options.index);
    setActiveIndex(options.index);
    setSelectedIndexes(new Set([options.index]));
  };

  const onMouseUp = (options) => {
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

  const clearSelection = (event) => {
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
      <Instructions>
        <div>Drag and drop Artists, Albums and Songs here</div>
        <div>Ctrl / Cmd + A is Select All</div>
        <div>Ctrl / Cmd + X is Cut</div>
        <div>Ctrl / Cmd + C is Copy</div>
        <div>Ctrl / Cmd + V is Paste</div>
        <div>Backspace / Del is Remove</div>
        <div>Ctrl / Cmd + Shift + D is Duplicate</div>
        <div>Enter is New Playlist From Selection</div>
        <div>Up Arrow is Move Up</div>
        <div>Down Arrow is Move Down</div>
      </Instructions>
    );
  }

  return (
    <Container
      ref={ref}
      className={PLAYLIST_CLASSNAME}
      onMouseDown={(event) => {
        onMouseDown({
          index:
            event.target.className === PLAYLIST_CLASSNAME
              ? playlist.length - 1
              : 0,
          isShiftDown: event.shiftKey,
        });
      }}
      onMouseUp={clearSelection}
      hideOverflow={hideOverflow}
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
            />
          )
      )}
    </Container>
  );
};

export default connect(
  (state) => ({
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
  }),
  (dispatch) => ({ dispatch })
)(Playlist);
