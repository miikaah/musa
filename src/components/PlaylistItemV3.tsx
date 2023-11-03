import { AudioWithMetadata } from "@miikaah/musa-core";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import isEqual from "lodash.isequal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";
import { PlayerState, playIndex, replay } from "../reducers/player.reducer";
import { formatDuration } from "../util";
import { ellipsisTextOverflow } from "../common.styles";
import AlbumImage from "./AlbumImage";
import { breakpoints } from "../breakpoints";

const colorCss = css`
  background-color: var(--color-primary-highlight);
  color: var(--color-typography-primary);

  > div {
    > div {
      > span {
        color: var(--color-typography-primary);
      }

      > button {
        > span {
          background-color: var(--color-typography-primary);
        }

        > svg > path {
          fill: var(--color-typography-primary);
          background-color: rgb(255, 255, 255, 0.333);
          border-radius: 50%;
          box-shadow: 0 0 0 5px rgb(255, 255, 255, 0.333);
        }
      }
    }
  }
`;

const PlaylistItemContainer = styled.li<{
  isMovingItems?: boolean;
  isActiveOrSelected?: boolean;
}>`
  cursor: pointer;
  display: flex;
  max-height: 60px;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: transparent;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: transparent;

  > div {
    > div {
      > button {
        > span {
          background-color: var(--color-bg);
        }

        > svg > path {
          fill: var(--color-bg);
        }
      }
    }
  }

  &:hover {
    ${({ isMovingItems }) =>
      isMovingItems
        ? `
      border-top-color: #f00;
      border-bottom-color: #f00;
      `
        : `
      border-top-color: transparent;
      border-bottom-color: transparent;
      `};
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

  > img {
    width: 50px;
    height: 50px;
    object-fit: scale-down;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 6px 16px 6px 12px;
`;

const FirstRow = styled.div`
  display: grid;
  grid-template-columns: 81fr 3fr 1fr 3fr 12fr;

  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 84fr 1fr 3fr 12fr;
  }
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
  ${ellipsisTextOverflow}
`;

const shadow = css`
  background-color: rgb(255, 255, 255, 0.333);
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgb(255, 255, 255, 0.333);
`;

const ActionButton = styled.button`
  display: inline-block;
  border: 1px solid transparent;
  position: relative;
  height: 100%;

  &:hover {
    ${shadow}
  }

  > span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    position: absolute;
    top: 6px;
  }

  > span:nth-of-type(1) {
    left: 2px;
  }

  > span:nth-of-type(2) {
    left: 8px;
  }

  > span:nth-of-type(3) {
    left: 14px;
  }
`;

const DeleteButton = styled(ActionButton)`
  min-width: 20px;
  margin-left: 4px;
`;

const EditButton = styled(ActionButton)`
  min-width: 21px;
`;

const Duration = styled.span`
  font-size: var(--font-size-xs);
  text-align: right;
`;

const SecondRow = styled.div`
  display: flex;
  font-size: var(--font-size-xxs);
  margin: 6px 0;
  color: var(--color-typography-ghost);
  min-height: 15px;
`;

const SecondRowItem = styled.span<{ hasMargins?: boolean }>`
  ${({ hasMargins }) => hasMargins && `margin: 0 2px;`}
`;

let touchTimeout: NodeJS.Timeout;

export type MouseUpDownOptions = {
  index: number;
  isShiftDown: boolean;
  isCtrlDown: boolean;
};

type PlaylistItemProps = {
  item: AudioWithMetadata;
  currentItem: PlayerState["currentItem"];
  currentIndex: PlayerState["currentIndex"];
  isPlaying: PlayerState["isPlaying"];
  index: number;
  activeIndex: number;
  startIndex: number;
  endIndex: number;
  isSelected: boolean;
  onSetActiveIndex: (index: number) => void;
  onMouseOverItem: (index: number) => void;
  onMouseDownItem: ({
    index,
    isShiftDown,
    isCtrlDown,
  }: MouseUpDownOptions) => void;
  onMouseUpItem: ({
    index,
    isShiftDown,
    isCtrlDown,
  }: MouseUpDownOptions) => void;
  onScrollPlaylist: () => void;
  toggleModal: (items: AudioWithMetadata[]) => void;
  removeItems: () => void;
  isMovingItems: boolean;
  dispatch: Dispatch;
};

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
  onSetActiveIndex,
  onMouseOverItem,
  onMouseDownItem,
  onMouseUpItem,
  onScrollPlaylist,
  toggleModal,
  removeItems,
  isMovingItems,
  dispatch,
}: PlaylistItemProps) => {
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoints.md);

  const elRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoints.md);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIsActiveOrSelected = ({
    index,
    activeIndex,
    startIndex,
    endIndex,
    isSelected,
  }: {
    index: number;
    activeIndex: number;
    startIndex: number;
    endIndex: number;
    isSelected: boolean;
  }) => {
    if (isMovingItems) return;

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    if (index === activeIndex) return true;
    if (
      (!Number.isNaN(startIndex) &&
        !Number.isNaN(endIndex) &&
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

  const handleMouseDown = (event: React.MouseEvent<HTMLLIElement>) => {
    onMouseDownItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey,
    });
    event.stopPropagation();
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLLIElement>) => {
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
    if (!isIndexCurrentIndex() || !elRef.current) {
      return;
    }

    const elRect = elRef.current.getBoundingClientRect();
    if (elRect.bottom > window.innerHeight - 1) {
      elRef.current.scrollIntoView(false); // Scrolls to correct song
      onScrollPlaylist(); // Scrolls a little bit down so current song isn't at bottom of view
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTouchTime < 500) {
      clearTimeout(touchTimeout);
      handleDoubleClick();
    } else {
      touchTimeout = setTimeout(() => {}, 500);
    }
    setLastTouchTime(now);
  };

  const artist = item?.metadata?.artist || item.artistName || "";
  const album = item?.metadata?.album || item.albumName || "";
  const title = item?.metadata?.title || item.name || "";
  const track = item.track || "";
  const duration = formatDuration(item?.metadata?.duration || "0:00");

  return (
    <PlaylistItemContainer
      ref={elRef}
      isActiveOrSelected={isActiveOrSelected()}
      isMovingItems={isMovingItems}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onMouseOver={() => onMouseOverItem(index)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Icon>{renderPlayOrPauseIcon()}</Icon>
      <CoverWrapper>
        <AlbumImage item={item} animate={false} />
      </CoverWrapper>
      <RowContainer>
        <FirstRow>
          <Title>{title}</Title>
          {!isMobile && (
            <EditButton onClick={() => toggleModal([item])}>
              <div />
              <span />
              <span />
              <span />
            </EditButton>
          )}
          <div />
          <DeleteButton onClick={removeItems}>
            <FontAwesomeIcon icon="xmark" />
          </DeleteButton>
          <Duration>{duration}</Duration>
        </FirstRow>
        <SecondRow>
          <SecondRowItem>{artist}</SecondRowItem>
          <SecondRowItem hasMargins={!!track}>
            {track ? "\u00B7" : ""}
          </SecondRowItem>
          <SecondRowItem>{track}</SecondRowItem>
          <SecondRowItem hasMargins={!!album}>
            {album ? "\u00B7" : ""}
          </SecondRowItem>
          <SecondRowItem>{album}</SecondRowItem>
        </SecondRow>
      </RowContainer>
    </PlaylistItemContainer>
  );
};

export default connect(
  (state: { player: PlayerState }) => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying,
  }),
  (dispatch) => ({ dispatch }),
)(PlaylistItem);
