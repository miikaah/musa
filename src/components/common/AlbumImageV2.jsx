import React from "react";
import { cleanUrl } from "../../util";

const AlbumImage = ({ item }) => <img alt="" src={cleanUrl(item.coverUrl)} />;

export default AlbumImage;
