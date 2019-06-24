import React from "react"
import { connect } from "react-redux"
import { isEmpty } from "lodash-es"
import { encodeFileUri } from "../util"
import { pasteToPlaylist } from "../reducers/player.reducer"
import "./Artist.scss"

const Artist = ({ item, dispatch }) => {
  if (isEmpty(item)) return null
  return (
    <div className="artist">
      <div>{item.name}</div>
      <div className="artist-album-list">
        {item.albums
          .filter(a => a.name !== "undefined")
          .map((a, i) => (
            <div
              className="artist-album-list-item"
              key={i}
              onClick={() =>
                dispatch(
                  pasteToPlaylist(
                    a.songs.map(s => ({
                      ...s,
                      cover: a.cover
                    }))
                  )
                )
              }
            >
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
export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Artist)
