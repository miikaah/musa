import React from "react";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash-es";
import styled, { css } from "styled-components/macro";
import { dispatchToast, formatDuration } from "../util";
import { addToPlaylist, pasteToPlaylist } from "reducers/player.reducer";
import Spotify from "services/spotify";
import {
  getSpotifyImage,
  SpotifyImage,
  getArtists,
  isSpotifyResource
} from "../spotify.util";
import AlbumImage from "./AlbumImage";
import AlbumInfo from "./AlbumInfo";

const AlbumContainer = styled.div`
  display: flex;
  flex: 100%;
  margin: 0 10px 60px 0;
`;

const bottomBorder = css`
  cursor: pointer;
  border: 2px solid transparent;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;
`;

const AlbumFullAdd = styled.div`
  display: flex;
  flex: 60%;
  ${bottomBorder}

  > img {
    min-width: 200px;
    max-width: 200px;
    min-height: 200px;
    max-height: 200px;
    background-color: #000;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const AlbumSongs = styled.div`
  flex: 40%;
  font-size: var(--font-size-sm);
`;

const AlbumSong = styled.div`
  display: flex;
  flex-direction: row;
  ${bottomBorder}

  > span {
    margin-bottom: 4px;
  }

  > span:nth-child(1) {
    flex: 12%;
    font-size: var(--font-size-xs);
  }

  > span:nth-child(2) {
    flex: 78%;
    padding-right: 4px;
  }

  > span:nth-child(3) {
    flex: 10%;
    font-size: var(--font-size-xs);
    text-align: right;
  }

  &:hover {
    border-color: var(--color-primary-highlight);
  }
`;

const Album = ({ item, spotifyTokens, dispatch }) => {
  if (isEmpty(item)) return null;

  const addSpotifyAlbum = async () => {
    const albumTracks = await Spotify.getAlbumsTracks(spotifyTokens, item);
    console.log(albumTracks);
    dispatch(
      pasteToPlaylist(
        albumTracks.items.map(i => ({
          ...i,
          metadata: {
            artist: getArtists(i),
            album: item.name,
            track: i.track_number,
            title: i.name,
            duration: formatDuration(i.duration_ms / 1000),
            date: item.release_date.split("-")[0]
          },
          cover: getSpotifyImage(item, SpotifyImage.Lg),
          isSpotify: true
        }))
      )
    );
  };

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

  const handleAlbumFullAdd = () => {
    return isSpotifyResource(item)
      ? addSpotifyAlbum()
      : addAlbumSongsToPlaylist();
  };

  const addSongToPlaylist = song => {
    dispatch(addToPlaylist({ ...song, cover: item.cover }));

    const title = get(song, "metadata.title", "");
    const msg = `Added ${title} to playlist`;
    const key = `${title}-${Date.now()}`;
    dispatchToast(msg, key, dispatch);
  };

  return (
    <AlbumContainer>
      <AlbumFullAdd onClick={handleAlbumFullAdd}>
        <AlbumImage item={item} />
        <AlbumInfo item={item} />
      </AlbumFullAdd>
      <AlbumSongs>
        {(item.songs || []).map((s, i) => (
          <AlbumSong key={i} onClick={() => addSongToPlaylist(s)}>
            <span>{get(s, "metadata.track", "")}</span>
            <span>{get(s, "metadata.title", "")}</span>
            <span>{get(s, "metadata.duration", "")}</span>
          </AlbumSong>
        ))}
      </AlbumSongs>
    </AlbumContainer>
  );
};

export default connect(
  state => ({
    spotifyTokens: state.settings.spotifyTokens
  }),
  dispatch => ({ dispatch })
)(Album);
