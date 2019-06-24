import React from "react"
import { isEmpty } from "lodash-es"
import { encodeFileUri } from "../util"
import "./Artist.scss"

const Artist = ({ item }) => {
  if (isEmpty(item)) return null
  return (
    <div className="artist">
      <div>{item.name}</div>
      <div className="artist-album-list">
        {item.albums
          .filter(a => a.name !== "undefined")
          .map((a, i) => (
            <div className="artist-album-list-item" key={i}>
              <img
                alt=""
                src={isEmpty(a.cover) ? "" : encodeFileUri(`file://${a.cover}`)}
              />
              <div>
                <p>{a.name}</p>
                <p>{a.date}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Artist
