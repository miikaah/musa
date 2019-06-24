import React from "react"
import { connect } from "react-redux"
import { get, isEmpty } from "lodash-es"
import { encodeFileUri, dispatchToast } from "../util"
import { addToPlaylist } from "../reducers/player.reducer"
import "./Song.scss"

const Song = ({ item, dispatch }) => {
  if (isEmpty(item)) return null

  const addSongToPlaylist = () => {
    dispatch(addToPlaylist(item))

    const msg = `Added ${item.name} to playlist`
    const key = `${item.name}-${Date.now()}`
    dispatchToast(msg, key, dispatch)
  }

  return (
    <div className="song" onClick={addSongToPlaylist}>
      <img
        alt=""
        src={isEmpty(item.cover) ? "" : encodeFileUri(`file://${item.cover}`)}
      />
      <div>
        <p>{get(item, "metadata.artist", "")}</p>
        <p>{get(item, "metadata.album", "")}</p>
        <p>{item.name}</p>
        <p>{get(item, "metadata.date", "")}</p>
      </div>
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Song)
