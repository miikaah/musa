import React from "react"
import { connect } from "react-redux"
import { isEmpty } from "lodash-es"
import { encodeFileUri, dispatchToast } from "../util"
import { pasteToPlaylist } from "../reducers/player.reducer"
import "./Artist.scss"

const Artist = ({ item, dispatch }) => {
  if (isEmpty(item)) return null

  const addAlbumSongsToPlaylist = album => {
    dispatch(
      pasteToPlaylist(
        album.songs.map(s => ({
          ...s,
          cover: album.cover
        }))
      )
    )
    const msg = `Added ${album.name} to playlist`
    const key = `${album.name}-${Date.now()}`
    dispatchToast(msg, key, dispatch)
  }
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
              onClick={() => addAlbumSongsToPlaylist(a)}
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
  state => ({
    messages: state.toaster.messages
  }),
  dispatch => ({ dispatch })
)(Artist)
