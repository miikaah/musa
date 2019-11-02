import React from "react";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash-es";
import { encodeFileUri, dispatchToast } from "../util";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import "./Album.scss";

const Album = ({ item, dispatch }) => {
  if (isEmpty(item)) return null;

  const addAlbumSongsToPlaylist = () => {
    dispatch(
      pasteToPlaylist(
        item.songs.map(s => ({
          ...s,
          cover: item.cover
        }))
      )
    );

    const msg = `Added ${item.name} to playlist`;
    const key = `${item.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  const addSongToPlaylist = song => {
    dispatch(addToPlaylist({ ...song, cover: item.cover }));

    const title = get(song, "metadata.title", "");
    const msg = `Added ${title} to playlist`;
    const key = `${title}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  return (
    <div className="album">
      <div className="album-full-add" onClick={addAlbumSongsToPlaylist}>
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
      </div>
      <div className="album-songs">
        {item.songs.map((s, i) => (
          <div
            className="album-song"
            key={i}
            onClick={() => addSongToPlaylist(s)}
          >
            <span>{get(s, "metadata.track", "")}</span>
            <span>{get(s, "metadata.title", "")}</span>
            <span>{get(s, "metadata.duration", "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(Album);
