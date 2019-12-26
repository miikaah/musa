import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { get, isNaN, isEqual } from "lodash-es";
import { playIndex, spotifyPlayIndex, replay } from "reducers/player.reducer";
import styled from "styled-components/macro";
import { Cell } from "../common.styles";
import { isSpotifyResource } from "../spotify.util";
import PlayIcon from "components/PlayIcon";
import PauseIcon from "components/PauseIcon";

const PlaylistItemContainer = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: var(--color-primary-highlight);
    color: var(--color-typography-primary);
  }

  ${({ isActiveOrSelected }) =>
    isActiveOrSelected &&
    `
    background-color: var(--color-primary-highlight);
    color: var(--color-typography-primary);
  `}
`;

const PlaylistItem = ({
  item,
  currentItem,
  currentIndex,
  isPlaying,
  spotifyTokens,
  index,
  activeIndex,
  startIndex,
  endIndex,
  isSelected,
  dispatch,
  onSetActiveIndex,
  onMouseOverItem,
  onMouseDownItem,
  onMouseUpItem,
  onScrollPlaylist
}) => {
  const elRef = useRef(null);

  const getIsActiveOrSelected = ({
    index,
    activeIndex,
    startIndex,
    endIndex,
    isSelected
  }) => {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    if (index === activeIndex) return true;
    if (
      (!isNaN(startIndex) &&
        !isNaN(endIndex) &&
        index >= start &&
        index <= end) ||
      isSelected
    )
      return true;
    return false;
  };

  const isActiveOrSelected = () =>
    getIsActiveOrSelected({
      index,
      activeIndex,
      startIndex,
      endIndex,
      isSelected
    });

  const isIndexCurrentIndex = () => {
    return index === currentIndex;
  };

  const hasEqualItemAndCurrentItem = () => {
    return isEqual(item, currentItem);
  };

  const shouldReplaySong = () => {
    return isIndexCurrentIndex() && hasEqualItemAndCurrentItem();
  };

  const handleDoubleClick = () => {
    if (shouldReplaySong()) {
      dispatch(replay(true));
      return;
    }
    dispatch(
      isSpotifyResource(item)
        ? spotifyPlayIndex(spotifyTokens, item, index)
        : playIndex(index)
    );
    onSetActiveIndex(index);
  };

  const handleMouseDown = event => {
    onMouseDownItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey
    });
    event.stopPropagation();
  };

  const handleMouseUp = event => {
    onMouseUpItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey
    });
    event.stopPropagation();
  };

  const renderPlayOrPauseIcon = () => {
    if (!isIndexCurrentIndex() || !hasEqualItemAndCurrentItem()) return;
    return isPlaying ? <PlayIcon isSmall /> : <PauseIcon isSmall />;
  };

  useEffect(() => {
    if (!isIndexCurrentIndex()) return;
    const elRect = elRef.current.getBoundingClientRect();
    if (elRect.bottom > window.innerHeight - 1) {
      elRef.current.scrollIntoView(false);
      onScrollPlaylist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <PlaylistItemContainer
      ref={elRef}
      isActiveOrSelected={isActiveOrSelected()}
      onDoubleClick={handleDoubleClick}
      onMouseOver={() => onMouseOverItem(index)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Cell size="xxs" textAlign="center">
        {renderPlayOrPauseIcon()}
      </Cell>
      <Cell size="sm">{get(item, "metadata.artist", "")}</Cell>
      <Cell size="sm">{get(item, "metadata.album", "")}</Cell>
      <Cell size="xs" textAlign="right">
        {get(item, "metadata.track", "")}
      </Cell>
      <Cell size="md">{get(item, "metadata.title", item.name)}</Cell>
      <Cell size="xs">{get(item, "metadata.duration", "")}</Cell>
      <Cell size="xs" textAlign="right">
        {get(item, "metadata.date", "")}
      </Cell>
    </PlaylistItemContainer>
  );
};

export default connect(
  state => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying,
    spotifyTokens: state.settings.spotifyTokens
  }),
  dispatch => ({ dispatch })
)(PlaylistItem);
