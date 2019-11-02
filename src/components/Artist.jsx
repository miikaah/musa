import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash-es";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import AlbumCover from "./AlbumCover";
import "./Artist.scss";

const Artist = ({ item, dispatch }) => {
  if (isEmpty(item)) return null;

  const addAlbumSongsToPlaylist = album => {
    dispatch(
      pasteToPlaylist(
        album.songs.map(s => ({
          ...s,
          cover: album.cover
        }))
      )
    );
    const msg = `Added ${album.name} to playlist`;
    const key = `${album.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };
  return (
    <div className="artist">
      <div>{item.name}</div>
      <div className="artist-album-list">
        {item.albums
          .filter(a => a.name !== "undefined")
          .map((a, i) => (
            <AlbumCover
              key={i}
              item={a}
              onClick={() => addAlbumSongsToPlaylist(a)}
            />
          ))}
      </div>
    </div>
  );
};

export default connect(
  state => ({
    messages: state.toaster.messages
  }),
  dispatch => ({ dispatch })
)(Artist);
