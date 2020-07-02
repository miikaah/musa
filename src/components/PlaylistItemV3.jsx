import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { get, isNaN, isEqual } from "lodash-es";
import { playIndex, replay } from "reducers/player.reducer";
import styled from "styled-components/macro";
import PlayIcon from "components/PlayIcon";
import PauseIcon from "components/PauseIcon";

const PlaylistItemContainer = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
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

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 40px;
`;

const IconTitleWrapper = styled.div`
  display: flex;
`;

const Icon = styled.span`
  width: 40px;
`;

const Title = styled.span`
  font-size: var(--font-size-sm);
  font-weight: bold;
  padding: 6px 8px 4px 0;
`;

const Duration = styled.span`
  align-self: flex-end;
  font-size: var(--font-size-xs);
`;

const SecondRow = styled.div`
  display: flex;
  font-size: var(--font-size-xxs);
  padding-left: 40px;
  margin-bottom: 12px;
`;

const SecondRowItem = styled.span`
  margin-right: 2px;
`;

const PlaylistItem = ({
  item,
  currentItem,
  currentIndex,
  isPlaying,
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
    dispatch(playIndex(index));
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

  const artist = get(item, "metadata.artist", "");
  const album = get(item, "metadata.album", "");
  const track = get(item, "metadata.track", "");
  const title = get(item, "metadata.title", item.name);
  const duration = get(item, "metadata.duration", "");

  return (
    <PlaylistItemContainer
      ref={elRef}
      isActiveOrSelected={isActiveOrSelected()}
      onDoubleClick={handleDoubleClick}
      onMouseOver={() => onMouseOverItem(index)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <FirstRow>
        <IconTitleWrapper>
          <Icon>{renderPlayOrPauseIcon()}</Icon>
          <Title>{title}</Title>
        </IconTitleWrapper>
        <Duration>{duration}</Duration>
      </FirstRow>
      <SecondRow>
        <SecondRowItem>{artist}</SecondRowItem>
        <SecondRowItem>{"\u00B7"}</SecondRowItem>
        <SecondRowItem>{track}</SecondRowItem>
        <SecondRowItem>{"\u00B7"}</SecondRowItem>
        <SecondRowItem>{album}</SecondRowItem>
      </SecondRow>
    </PlaylistItemContainer>
  );
};

export default connect(
  state => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlaylistItem);
