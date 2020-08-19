import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash-es";
import styled from "styled-components/macro";
import { dispatchToast } from "../util";
import { pasteToPlaylist } from "reducers/player.reducer";
import AlbumCover from "./common/AlbumCover";

const ArtistContainer = styled.div`
  flex: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const ArtistName = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
`;

const ArtistAlbumList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 50%;
`;

const Artist = ({ item, dispatch }) => {
  if (isEmpty(item)) return null;

  const addAlbumSongsToPlaylist = (album) => {
    dispatch(
      pasteToPlaylist(
        album.songs.map((s) => ({
          ...s,
          cover: album.cover,
        }))
      )
    );
    const msg = `Added ${album.name} to playlist`;
    const key = `${album.name}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };
  return (
    <ArtistContainer>
      <ArtistName>{item.name}</ArtistName>
      <ArtistAlbumList>
        {item.albums
          .filter((a) => a.name !== "undefined")
          .map((a, i) => (
            <AlbumCover
              key={i}
              item={a}
              onClick={() => addAlbumSongsToPlaylist(a)}
            />
          ))}
      </ArtistAlbumList>
    </ArtistContainer>
  );
};

export default connect(
  (state) => ({
    messages: state.toaster.messages,
  }),
  (dispatch) => ({ dispatch })
)(Artist);
