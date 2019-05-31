import React, { useState } from "react"
import { connect } from "react-redux"
import LibraryItem from "./LibraryItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { flatten, defaultTo, isNaN } from "lodash-es"
import "./LibraryList.scss"

const LibraryList = ({ item, cover, isRoot, dispatch }) => {
  const [showFolderItems, setShowFolderItems] = useState(false)
  const isArtist = Array.isArray(item.albums)
  const isAlbum = Array.isArray(item.songs)
  const isUndefinedItemName = item.name === "undefined"

  const toggleFolder = event => {
    event.preventDefault()
    setShowFolderItems(!showFolderItems)
  }

  const getArtistOrAlbumSongs = () => {
    if (isArtist)
      return flatten(
        item.albums.map(a =>
          defaultTo(a.songs, []).map(s => ({ ...s, cover: a.cover }))
        )
      )
    if (isAlbum) return item.songs.map(song => ({ ...song, cover: item.cover }))
  }

  const onDragStart = event => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify(getArtistOrAlbumSongs())
    )
    event.stopPropagation()
  }

  const renderItemsWithoutAlbum = () =>
    item.songs.filter(Boolean).map((song, i) => {
      return <LibraryItem key={`${song.name}-${i}`} item={song} />
    })

  const renderCaret = () =>
    isAlbum &&
    isNaN(parseInt(item.date, 10)) && (
      <FontAwesomeIcon className="caret-right" icon="caret-right" />
    )

  const renderFolderName = () =>
    isAlbum && parseInt(item.date, 10) > 0
      ? `${item.date} - ${item.name}`
      : item.name

  const renderArtistsAndAlbums = () => (
    <ul
      className={`library-list ${isRoot ? "root" : ""}`}
      draggable
      onDragStart={onDragStart}
    >
      <li
        className="library-list-folder"
        key={item.name}
        onClick={toggleFolder}
      >
        {renderCaret()}
        {renderFolderName()}
      </li>
      {showFolderItems &&
        (item.albums || item.songs).map((child, i) => (
          <LibraryList
            key={`${child.name}-${i}`}
            item={child}
            cover={item.cover}
            dispatch={dispatch}
          />
        ))}
    </ul>
  )

  if (isArtist || isAlbum) {
    return isUndefinedItemName
      ? renderItemsWithoutAlbum()
      : renderArtistsAndAlbums()
  }
  return (
    <LibraryItem key={item.name + "-" + Date.now()} item={item} cover={cover} />
  )
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryList)
