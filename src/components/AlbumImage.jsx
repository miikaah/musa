import React from "react";
import { isEmpty } from "lodash-es";
import { encodeFileUri } from "../util";

const AlbumImage = ({ item }) => (
  <img
    alt=""
    src={isEmpty(item.cover) ? "" : encodeFileUri(`file://${item.cover}`)}
  />
);

export default AlbumImage;
