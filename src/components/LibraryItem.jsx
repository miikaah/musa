import React from "react"
import { connect } from "react-redux"
import { get } from "lodash-es"
import { addToPlaylist } from "../reducers/player.reducer"
import "./LibraryItem.scss"

const LibraryItem = ({ item, cover, dispatch }) => {
  const onDragStart = event => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item))
    event.stopPropagation()
  }

  return (
    <li
      className="library-item"
      draggable
      onDragStart={onDragStart}
      onDoubleClick={() => dispatch(addToPlaylist(item))}
    >
      {get(item, "metadata.title", item.name)}
    </li>
  )
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryItem)
