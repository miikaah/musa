import React from "react"
import { get, isEmpty } from "lodash-es"
import { encodeFileUri } from "../util"
import "./Song.scss"

const Song = ({ item }) => {
  if (isEmpty(item)) return null
  return (
    <div className="song">
      <img alt="" src={encodeFileUri(item.cover)} />
      <div>
        <p>{get(item, "metadata.artist", "")}</p>
        <p>{get(item, "metadata.album", "")}</p>
        <p>{item.name}</p>
        <p>{get(item, "metadata.date", "")}</p>
      </div>
    </div>
  )
}

export default Song
