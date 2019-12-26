import React from "react";
import { isEmpty } from "lodash-es";
import { getFileUri } from "../util";
import { getSpotifyImage, SpotifyImage } from "../spotify.util";

const AlbumImage = ({ item }) => (
  <img
    alt=""
    src={
      isEmpty(item.cover)
        ? getSpotifyImage(item, SpotifyImage.Md)
        : getFileUri(item.cover)
    }
  />
);

export default AlbumImage;
