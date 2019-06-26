import React, { useState } from "react"
import { connect } from "react-redux"
import { flatten, defaultTo } from "lodash-es"
import LibraryItem from "./LibraryItem"
import AlbumCover from "./AlbumCover"
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

  const renderFolderName = () =>
    isAlbum ? <AlbumCover item={item} /> : item.name

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
  return <LibraryItem item={item} cover={cover} hasAlbum />
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(LibraryList)
