import React from "react"
import { isEmpty } from "lodash-es"
import { encodeFileUri } from "../util"
import "./AlbumCover.scss"

const AlbumCover = ({ item, onClick }) => (
  <div className="album-cover" onClick={onClick}>
    <img
      alt=""
      src={isEmpty(item.cover) ? "" : encodeFileUri(`file://${item.cover}`)}
    />
    <div>
      <p>{item.name}</p>
      <p>{item.date}</p>
    </div>
  </div>
)

export default AlbumCover
