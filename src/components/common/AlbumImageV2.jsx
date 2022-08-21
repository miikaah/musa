import React from "react";
import styled from "styled-components/macro";
import { cleanUrl } from "../../util";
import { fadeIn } from "animations";

const Image = styled.img`
  animation: ${fadeIn} 0.2s;
  object-fit: scale-down;
`;

const AlbumImage = ({ item }) => <Image alt="" src={cleanUrl(item.coverUrl)} />;

export default AlbumImage;
