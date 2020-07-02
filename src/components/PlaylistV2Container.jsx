import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import Playlist from "./PlaylistV2";

const Container = styled.div`
  padding: 30px;
  max-width: 1000px;
  margin: auto;
`;

const PlaylistV2Container = ({ onScrollPlaylist, playlist }) => {
  let currentArtistAlbum = "";
  const byAlbum = (acc, item) => {
    const itemArtistAlbum = `${item.metadata.artist}-${item.metadata.album}`;

    if (currentArtistAlbum === itemArtistAlbum) {
      acc[acc.length - 1].items.push(item);
    } else {
      currentArtistAlbum = itemArtistAlbum;
      acc.push({
        artist: item.metadata.artist,
        album: item.metadata.album,
        date: item.metadata.date,
        genre: item.metadata.genre,
        cover: item.cover,
        items: [item]
      });
    }
    return acc;
  };

  return (
    <Container>
      {playlist.reduce(byAlbum, []).map((album, index) => (
        <Playlist
          key={`${album.name}-${index}`}
          album={album}
          onScrollPlaylist={onScrollPlaylist}
        />
      ))}
    </Container>
  );
};

export default connect(
  state => ({
    playlist: state.player.items
  }),
  dispatch => ({ dispatch })
)(PlaylistV2Container);
