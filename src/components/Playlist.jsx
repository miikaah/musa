import React, { useState } from "react";
import { connect } from "react-redux";
import { isNaN, isEqual } from "lodash-es";
import styled from "styled-components/macro";
import {
  pasteToPlaylist,
  removeRangeFromPlaylist,
  removeIndexesFromPlaylist,
  playIndex,
  replay
} from "reducers/player.reducer";
import { KEYS, isCtrlDown } from "../util";
import { breakpoint } from "../breakpoints";
import { Cell } from "../common.styles";
import { useKeyPress } from "../hooks";
import PlaylistItem from "./PlaylistItem";

const PlaylistContainer = styled.ul`
  padding: 0 8px 0 0;
  margin: 0;
  font-size: 0.85rem;
  border: 0 solid var(--color-primary-highlight);
  border-left-width: 1px;
  border-right-width: 3px;
  background-color: var(--color-bg);
  box-shadow: -22px 10px 31px -16px rgba(10, 10, 10, 0.75);
  min-height: 94vh;

  @media (max-width: ${breakpoint.lg}) {
    border-left-width: 3px;
    max-height: none;
    height: auto;
  }
`;

const PlaylistHeader = styled.li`
  display: flex;
  justify-content: center;
  font-weight: bold;
`;

const PLAYLIST_CLASSNAME = "playlist";

const Playlist = ({
  onScrollPlaylist,
  playlist,
  currentItem,
  currentIndex,
  dispatch
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [startIndex, setStartIndex] = useState(NaN);
  const [endIndex, setEndIndex] = useState(NaN);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);

  const isContinuousSelection = () => {
    return (
      !isNaN(startIndex) &&
      !isNaN(endIndex) &&
      startIndex !== endIndex &&
      selectedIndexes.size < 2
    );
  };

  const getContinuousSelData = getSelected => {
    const sIndex = Math.min(startIndex, endIndex);
    const eIndex = Math.max(startIndex, endIndex);
    const selectedItems = getSelected
      ? playlist.filter((_, index) => index >= sIndex && index <= eIndex)
      : clipboard;
    return { startIndex: sIndex, endIndex: eIndex, selectedItems };
  };

  const handleContinuousSelection = ({ type, getSelected = true }) => {
    const { startIndex, endIndex, selectedItems } = getContinuousSelData(
      getSelected
    );

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

  const getIndexesSelData = getSelected => {
    const indexes =
      selectedIndexes.size > 0
        ? Array.from(selectedIndexes.values())
        : [activeIndex];
    const selectedItems = getSelected
      ? indexes.map(i => playlist[i])
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
      setStartIndex(!isNaN(startIndex) ? startIndex : activeIndex);
      setEndIndex(newActiveIndex);
      setActiveIndex(newActiveIndex);
      return;
    }
    setStartIndex(NaN);
    setEndIndex(NaN);
    setActiveIndex(newActiveIndex);
    setSelectedIndexes(new Set());
  };

  const selectAll = event => {
    if (!isCtrlDown(event)) return;
    setStartIndex(0);
    setEndIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.A, selectAll);

  const moveUp = event => {
    event.preventDefault();
    if (activeIndex - 1 > -1) return setNewIndexes(event, activeIndex - 1);
    if (playlist.length) return setActiveIndex(playlist.length - 1);
  };
  useKeyPress(KEYS.Up, moveUp);

  const moveDown = event => {
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

      dispatch(removeRangeFromPlaylist(0, playlist.length - 1));
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
        getSelected: false
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

  const cut = event => {
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

  const copy = event => {
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

  const duplicate = event => {
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

  const paste = event => {
    if (!isCtrlDown(event)) return;
    dispatch(
      pasteToPlaylist(clipboard, event.shiftKey ? activeIndex - 1 : activeIndex)
    );
  };
  useKeyPress(KEYS.V, paste);

  const updateEndIndex = endIndex => {
    if (!isMouseDown) return;
    setEndIndex(endIndex);
  };

  const onMouseDown = options => {
    if (options.isShiftDown || options.isCtrlDown) return;
    setIsMouseDown(true);
    setStartIndex(options.index);
    setEndIndex(options.index);
    setActiveIndex(options.index);
    setSelectedIndexes(new Set([options.index]));
  };

  const onMouseUp = options => {
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

  const clearSelection = event => {
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

  return (
    <PlaylistContainer
      className={PLAYLIST_CLASSNAME}
      onMouseDown={event => {
        onMouseDown({
          index:
            event.target.className === PLAYLIST_CLASSNAME
              ? playlist.length - 1
              : 0,
          isShiftDown: event.shiftKey
        });
      }}
      onMouseUp={clearSelection}
    >
      <PlaylistHeader>
        <Cell size="xxs" />
        <Cell size="sm">Artist</Cell>
        <Cell size="sm">Album</Cell>
        <Cell size="xs" textAlign="right">
          Tr
        </Cell>
        <Cell size="md">Title</Cell>
        <Cell size="xs">Length</Cell>
        <Cell size="xs" textAlign="right">
          Date
        </Cell>
      </PlaylistHeader>
      {playlist.map((item, index) => (
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
          onScrollPlaylist={onScrollPlaylist}
        />
      ))}
    </PlaylistContainer>
  );
};

export default connect(
  state => ({
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex
  }),
  dispatch => ({ dispatch })
)(Playlist);
