import React from "react"
import { get, isEmpty } from "lodash-es"
import { encodeFileUri } from "../util"
import "./Album.scss"

const Album = ({ item }) => {
  if (isEmpty(item)) return null
  return (
    <div className="album">
      <img
        alt=""
        src={isEmpty(item.cover) ? "" : encodeFileUri(`file://${item.cover}`)}
      />
      <div className="album-info">
        <p>{item.artist}</p>
        <p>{item.name}</p>
        <p>{item.date}</p>
        <p>{item.genre}</p>
      </div>
      <div className="album-songs">
        {item.songs.map((s, i) => (
          <div className="album-song-list" key={i}>
            <span>{get(s, "metadata.track", "")}</span>
            <span>{get(s, "metadata.title", "")}</span>
            <span>{get(s, "metadata.duration", "")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Album
