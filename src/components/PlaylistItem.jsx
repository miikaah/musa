import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { get, isNaN, isEqual } from "lodash-es"
import { playIndex, replay } from "../reducers/player.reducer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./PlaylistItem.scss"

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
  const elRef = useRef(null)

  const getClassNames = ({
    index,
    activeIndex,
    startIndex,
    endIndex,
    isSelected
  }) => {
    let className = "playlist-item"
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)
    if (index === activeIndex) className += " active"
    if (
      (!isNaN(startIndex) &&
        !isNaN(endIndex) &&
        index >= start &&
        index <= end) ||
      isSelected
    )
      className += " selected"
    return className
  }

  const classes = getClassNames({
    index,
    activeIndex,
    startIndex,
    endIndex,
    isSelected
  })

  const isIndexCurrentIndex = () => {
    return index === currentIndex
  }

  const hasEqualItemAndCurrentItem = () => {
    return isEqual(item, currentItem)
  }

  const shouldReplaySong = () => {
    return isIndexCurrentIndex() && hasEqualItemAndCurrentItem()
  }

  const handleDoubleClick = () => {
    if (shouldReplaySong()) {
      dispatch(replay(true))
      return
    }
    dispatch(playIndex(index))
    onSetActiveIndex(index)
  }

  const handleMouseDown = event => {
    onMouseDownItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey
    })
    event.stopPropagation()
  }

  const handleMouseUp = event => {
    onMouseUpItem({
      index,
      isShiftDown: event.shiftKey,
      isCtrlDown: event.ctrlKey || event.metaKey
    })
    event.stopPropagation()
  }

  const renderPlayOrPauseIcon = () => {
    if (!isIndexCurrentIndex() || !hasEqualItemAndCurrentItem()) return
    return isPlaying ? (
      <FontAwesomeIcon icon="play" />
    ) : (
      <FontAwesomeIcon icon="pause" />
    )
  }

  useEffect(() => {
    if (!isIndexCurrentIndex()) return
    const elRect = elRef.current.getBoundingClientRect()
    if (elRect.bottom > window.innerHeight - 1) {
      elRef.current.scrollIntoView(false)
      onScrollPlaylist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  return (
    <li
      ref={elRef}
      className={classes}
      onDoubleClick={handleDoubleClick}
      onMouseOver={() => onMouseOverItem(index)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="cell cell-xxs">{renderPlayOrPauseIcon()}</div>
      <div className="cell cell-sm left">
        {get(item, "metadata.artist", "")}
      </div>
      <div className="cell cell-sm left">{get(item, "metadata.album", "")}</div>
      <div className="cell cell-xs right">
        {get(item, "metadata.track", "")}
      </div>
      <div className="cell cell-md left">
        {get(item, "metadata.title", item.name)}
      </div>
      <div className="cell cell-xs left">
        {get(item, "metadata.duration", "")}
      </div>
      <div className="cell cell-xs right">{get(item, "metadata.date", "")}</div>
    </li>
  )
}

export default connect(
  state => ({
    currentItem: state.player.currentItem,
    currentIndex: state.player.currentIndex,
    isPlaying: state.player.isPlaying
  }),
  dispatch => ({ dispatch })
)(PlaylistItem)
