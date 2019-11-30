import React from "react";
import { isEmpty } from "lodash-es";
import { getFileUri } from "../util";

const AlbumImage = ({ item }) => (
  <img alt="" src={isEmpty(item.cover) ? "" : getFileUri(item.cover)} />
);

export default AlbumImage;
