import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { get, isNaN, isEqual } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components/macro";
import { playIndex, replay } from "reducers/player.reducer";

const colorCss = css`
  background-color: var(--color-primary-highlight);
  color: var(--color-typography-primary);

  > div {
    > div {
      > span {
        color: var(--color-typography-primary);
      }
    }
  }
`;

const PlaylistItemContainer = styled.li`
  cursor: pointer;
  display: flex;
  max-height: 60px;

  &:hover {
    ${colorCss}
  }

  ${({ isActiveOrSelected }) =>
    isActiveOrSelected &&
    `
    ${colorCss}
  `}
`;

const CoverWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 50px;
  min-height: 50px;
`;

const CoverSmall = styled.img`
  width: 50px;
  height: 50px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 40px 4px 12px;
`;

const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
`;

const Title = styled.span`
  font-size: var(--font-size-sm);
  font-weight: normal;
`;

const Duration = styled.span`
  align-self: flex-end;
  font-size: var(--font-size-xs);
`;

const SecondRow = styled.div`
  display: flex;
  font-size: var(--font-size-xxs);
  padding-left: 12px;
  margin-bottom: 12px;
  color: var(--color-typography-ghost);
  min-height: 15px;
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
  onScrollPlaylist,
}) => {
  const elRef = useRef(null);

  const getIsActiveOrSelected = ({
    index,
    activeIndex,
    startIndex,
    endIndex,
    isSelected,
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
      isSelected,
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

  const handleMouseDown = (event) => {
    onMouseDownItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey,
    });
    event.stopPropagation();
  };

  const handleMouseUp = (event) => {
    onMouseUpItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey,
    });
    event.stopPropagation();
  };

  const renderPlayOrPauseIcon = () => {
    if (!isIndexCurrentIndex() || !hasEqualItemAndCurrentItem()) return;
    return isPlaying ? (
      <FontAwesomeIcon icon="play" />
    ) : (
      <FontAwesomeIcon icon="pause" />
    );
  };

  useEffect(() => {
    if (!isIndexCurrentIndex()) return;
    const elRect = elRef.current.getBoundingClientRect();
    if (elRect.bottom > window.innerHeight - 1) {
      elRef.current.scrollIntoView(false); // Scrolls to correct song
      onScrollPlaylist(); // Scrolls a little bit down so current song isn't at bottom of view
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const artist = get(item, "metadata.artist", "");
  const album = get(item, "metadata.album", "");
  const track = get(item, "metadata.track", "");
  const title = get(item, "metadata.title", item.name);
  const duration = get(item, "metadata.duration", "");
  const coverSrc = get(item, "cover", "");

  return (
    <PlaylistItemContainer
      ref={elRef}
      isActiveOrSelected={isActiveOrSelected()}
      onDoubleClick={handleDoubleClick}
      onMouseOver={() => onMouseOverItem(index)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Icon>{renderPlayOrPauseIcon()}</Icon>
      <CoverWrapper>
        {coverSrc && <CoverSmall src={`file://${coverSrc}`} alt="" />}
      </CoverWrapper>
      <RowContainer>
        <FirstRow>
          <Title>{title}</Title>
          <Duration>{duration}</Duration>
        </FirstRow>
        <SecondRow>
          <SecondRowItem>{artist}</SecondRowItem>
          <SecondRowItem>{track ? "\u00B7" : ""}</SecondRowItem>
          <SecondRowItem>{track}</SecondRowItem>
          <SecondRowItem>{album ? "\u00B7" : ""}</SecondRowItem>
          <SecondRowItem>{album}</SecondRowItem>
        </SecondRow>
      </RowContainer>
    </PlaylistItemContainer>
  );
};

export default connect(
  (state) => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying,
  }),
  (dispatch) => ({ dispatch })
)(PlaylistItem);
