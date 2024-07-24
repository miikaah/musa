import { AudioWithMetadata } from "@miikaah/musa-core";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import isEqual from "lodash.isequal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";
import { PlayerState, playIndex, replay } from "../../reducers/player.reducer";
import { formatDuration } from "../../util";
import { ellipsisTextOverflow } from "../../common.styles";
import AlbumImage from "../AlbumImage";
import { breakpoints } from "../../breakpoints";

const contextMenuButtonId = "PlaylistItemContextMenuButton";

export const playlistItemMaxHeight = 60;

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
  max-height: ${playlistItemMaxHeight}px;
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
  box-shadow: 0 0 0 8px rgb(255, 255, 255, 0.333);
`;

const ActionButton = styled.button`
  display: inline-block;
  border: 1px solid transparent;
  position: relative;
  height: 100%;
  max-width: 21px;
  min-width: 21px;

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
  margin-left: 4px;
`;

const ContextMenuButton = styled(ActionButton)``;

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
  isMultiSelect: boolean;
  stopPropagation: boolean;
};

export type ContextMenuOptions = {
  clientX: number;
  clientY: number;
};

type PlaylistItemProps = {
  currentItem: PlayerState["currentItem"];
  currentIndex: PlayerState["currentIndex"];
  isPlaying: PlayerState["isPlaying"];
  item: AudioWithMetadata;
  index: number;
  activeIndex: number;
  startIndex: number;
  endIndex: number;
  isSelected: boolean;
  isMovingItems: boolean;
  onSetActiveIndex: (index: number) => void;
  onMouseOverItem: (index: number) => void;
  onMouseDownItem: (options: MouseUpDownOptions) => void;
  onMouseUpItem: (options: MouseUpDownOptions) => void;
  onContextMenu: (options: ContextMenuOptions) => void;
  onScrollPlaylist: () => void;
  removeItems: () => void;
};

const PlaylistItem = ({
  currentItem,
  currentIndex,
  isPlaying,
  item,
  index,
  activeIndex,
  startIndex,
  endIndex,
  isSelected,
  isMovingItems,
  onSetActiveIndex,
  onMouseOverItem,
  onMouseDownItem,
  onMouseUpItem,
  onContextMenu,
  onScrollPlaylist,
  removeItems,
}: PlaylistItemProps) => {
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoints.md);
  const dispatch = useDispatch();

  const playlistItemRef = useRef<HTMLLIElement | null>(null);

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

  // const checkIsContextMenuPress = (event: React.MouseEvent<HTMLLIElement>) => {
  //   if (event.target instanceof Element) {
  //     if (
  //       event.target.id === editButtonId ||
  //       event.target.parentElement?.id === editButtonId
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // const handleMouseDown = (
  //   event: React.MouseEvent<HTMLLIElement>,
  //   isContextMenuPress = false,
  // ) => {
  //   onMouseDownItem({
  //     index,
  //     isShiftDown: event.shiftKey,
  //     isCtrlDown: event.ctrlKey || event.metaKey,
  //     isContextMenuPress: isContextMenuPress || checkIsContextMenuPress(event),
  //     clientX: event.clientX,
  //     clientY: event.clientY,
  //   });
  //   event.stopPropagation();
  // };

  // const handleMouseUp = (event: React.MouseEvent<HTMLLIElement>) => {
  //   console.log("mup", event);
  //   onMouseUpItem({
  //     index,
  //     isShiftDown: event.shiftKey,
  //     isCtrlDown: event.ctrlKey || event.metaKey,
  //     isContextMenuPress: checkIsContextMenuPress(event),
  //   });
  //   event.stopPropagation();
  // };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLLIElement | HTMLButtonElement>,
  ) => {
    onContextMenu({
      clientX: event.clientX,
      clientY: event.clientY,
    });
    event.stopPropagation();
  };

  const renderPlayOrPauseIcon = () => {
    if (!isIndexCurrentIndex() || !hasEqualItemAndCurrentItem()) return;
    return isPlaying ? (
      <FontAwesomeIcon icon="play" data-testid="PlaylistItemPlayIcon" />
    ) : (
      <FontAwesomeIcon icon="pause" data-testid="PlaylistItemPauseIcon" />
    );
  };

  useEffect(() => {
    if (!isIndexCurrentIndex() || !playlistItemRef.current) {
      return;
    }

    const elRect = playlistItemRef.current.getBoundingClientRect();
    if (elRect.bottom > window.innerHeight - 1) {
      playlistItemRef.current.scrollIntoView(false); // Scrolls to correct song
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
      ref={playlistItemRef}
      isActiveOrSelected={isActiveOrSelected()}
      isMovingItems={false}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onMouseOver={() => onMouseOverItem(index)}
      onContextMenu={handleContextMenu}
      data-testid="PlaylistItemContainer"
    >
      <Icon>{renderPlayOrPauseIcon()}</Icon>
      <CoverWrapper>
        <AlbumImage item={item} animate={false} />
      </CoverWrapper>
      <RowContainer>
        <FirstRow>
          <Title>{title}</Title>
          {!isMobile && (
            <ContextMenuButton
              id={contextMenuButtonId}
              data-testid={contextMenuButtonId}
              onClick={handleContextMenu}
            >
              <div />
              <span />
              <span />
              <span />
            </ContextMenuButton>
          )}
          <div />
          <DeleteButton
            onClick={removeItems}
            data-testid="PlaylistItemDeleteButton"
          >
            <FontAwesomeIcon
              icon="xmark"
              data-testid="PlaylistItemDeleteButtonIcon"
            />
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

export default connect((state: { player: PlayerState }) => ({
  currentItem: state.player.currentItem,
  currentIndex: state.player.currentIndex,
  isPlaying: state.player.isPlaying,
}))(PlaylistItem);
