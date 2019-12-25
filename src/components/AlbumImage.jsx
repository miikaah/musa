import React from "react";
import { isEmpty, get } from "lodash-es";
import { getFileUri } from "../util";

const SPOTIFY_IMAGE_HEIGHT_MD = 300;

const getSpotifyImage = item => {
  if (!item.images && !get(item, "album.images")) return "";
  // Find image for album
  const image = (item.images || []).find(
    i => i.height === SPOTIFY_IMAGE_HEIGHT_MD
  );
  if (image) return image.url;
  // Find image for track
  if (item.album) {
    const spotifyImage = item.album.images.find(
      i => i.height === SPOTIFY_IMAGE_HEIGHT_MD
    );
    return spotifyImage && spotifyImage.url;
  }
};

const AlbumImage = ({ item }) => (
  <img
    alt=""
    src={isEmpty(item.cover) ? getSpotifyImage(item) : getFileUri(item.cover)}
  />
);

export default AlbumImage;
