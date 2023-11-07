import { AlbumWithFilesAndMetadata, Artist } from "@miikaah/musa-core";
import React, { useState, useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import LibraryItem from "./LibraryItem";
import AlbumCover from "./AlbumCover";
import { isElectron } from "../config";
import Api from "../apiClient";
import {
  expandHeight,
  contractHeight,
  fadeOut,
  expandHeightAlbum,
  contractHeightAlbum,
} from "../animations";
import { pasteToPlaylist } from "../reducers/player.reducer";
import { breakpoints } from "../breakpoints";
import { EnrichedAlbumFile } from "@miikaah/musa-core/lib/db.types";

const getExpandTiming = (len: number) => {
  if (len < 2) {
    return "0.1s";
  } else if (len < 7) {
    return "0.1666s";
  } else if (len < 10) {
    return "0.2666s";
  } else if (len < 14) {
    return "0.3666s";
  } else if (len < 18) {
    return "0.4666s";
  } else if (len < 22) {
    return "0.5666s";
  } else {
    return "0.6s";
  }
};

const getContractTiming = (len: number) => {
  if (len < 2) {
    return "0.1666s";
  } else if (len < 7) {
    return "0.2s";
  } else {
    return "0.3s";
  }
};

const Container = styled.ul<{
  isRoot?: boolean;
  expand: boolean;
  albumsLen: number;
  songsLen: number;
  filesLen: number;
}>`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
  padding-left: ${({ isRoot }) => (isRoot ? 0 : 12)}px;
  padding-right: 12px;
  ${({ isRoot, expand, albumsLen, songsLen, filesLen }) => {
    if (expand) {
      if (isRoot) {
        return css`
          overflow: hidden;
          animation: ${expandHeight(albumsLen, filesLen)}
            ${getExpandTiming(albumsLen)} ease-out;
        `;
      } else {
        return css`
          overflow: hidden;
          animation: ${expandHeightAlbum(songsLen)} 0.1666s ease-out;
        `;
      }
    } else {
      if (isRoot) {
        return css`
          overflow: hidden;
          animation: ${contractHeight(albumsLen, filesLen)}
            ${getContractTiming(albumsLen)} ease;

          > ul {
            animation: ${fadeOut} ${getContractTiming(albumsLen)};
          }
        `;
      } else {
        return css`
          overflow: hidden;
          animation: ${contractHeightAlbum(songsLen)} 0.1666s ease;

          > ul,
          li:not(:first-of-type) {
            animation: ${fadeOut} 0.1666s;
          }
        `;
      }
    }
  }}

  > li:nth-child(2) {
    padding-top: 4px;
  }

  > li:last-child:not(:first-child) {
    margin-bottom: 20px;
  }

  > li:hover {
    background-color: var(--color-secondary-highlight);
    color: var(--color-typography-secondary);
  }
`;

const Folder = styled.li`
  cursor: pointer;
  padding: 2px 12px;
  letter-spacing: 0.666px;

  > div {
    max-width: 100%;
    border: 0;
    margin: 5px 0;
  }

  > p {
    margin: 0;
  }
`;

let startX = 0;
let hasDragged = false;
let startScrollPos = 0;
let scrollPos = 0;

type LibraryListItem =
  | Artist["albums"][0]
  | AlbumWithFilesAndMetadata["files"][0];

type LibraryListProps = {
  item: LibraryListItem;
  isArtist?: boolean;
  isAlbum?: boolean;
  hasMultipleDisks?: boolean;
};

const getId = (item: LibraryListItem): string => {
  return isElectron ? item.id : item.url || "";
};

const isArtistAlbum = (
  _item: LibraryListItem, // Pretty ridiculous one can make a type predicate this way
  isAlbum?: boolean,
): _item is Artist["albums"][0] => {
  return Boolean(isAlbum);
};

const LibraryList = ({
  item,
  isArtist,
  isAlbum,
  hasMultipleDisks,
}: LibraryListProps) => {
  const [albums, setAlbums] = useState<Artist["albums"]>([]);
  const [songs, setSongs] = useState<AlbumWithFilesAndMetadata["files"]>([]);
  const [files, setFiles] = useState<Artist["files"]>([]);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const [isLongTouch, setIsLongTouch] = useState(false);

  const dispatch = useDispatch();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef(null);

  const toggleAlbum = async () => {
    if (albums.length < 1 && !showAlbums) {
      const artist = await Api.getArtistById(getId(item));

      setAlbums(artist.albums);
      setFiles(artist.files);
    }

    if (!showAlbums) {
      setShowAlbums(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      setTimeout(
        () => setShowAlbums(false),
        Number(getContractTiming(albums.length).replace("s", "")) * 1000 - 100,
      );
    }
  };

  const toggleSongs = async () => {
    if (songs.length < 1 && !showSongs) {
      const album = await Api.getAlbumById(getId(item));

      setSongs(album.files);
    }

    if (!showSongs) {
      setShowSongs(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      setTimeout(() => setShowSongs(false), 150);
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLUListElement>) => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ isArtist, isAlbum, item }),
    );

    event.stopPropagation();
  };

  const onTouchStart = (event: React.TouchEvent) => {
    hasDragged = false;
    startX = event.touches[0].clientX;

    if (window.innerWidth < breakpoints.sm) {
      timerRef.current = setTimeout(() => {
        setIsLongTouch(true);
      }, 500);

      const { scrollTop } = document.getElementById(
        "LibraryContainer",
      ) as HTMLElement;
      startScrollPos = scrollTop;
      scrollPos = scrollTop;
    }
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const deltaX = event.touches[0].clientX - startX;

    if (Math.abs(deltaX) > 100) {
      hasDragged = true;
    }
  };

  const onTouchEnd = async (event: React.TouchEvent) => {
    if (!timerRef.current) {
      return;
    }

    if ((!hasDragged && !isLongTouch) || startScrollPos !== scrollPos) {
      startX = 0;
      clearTimeout(timerRef.current);
      setIsLongTouch(false);
      return;
    }
    event.preventDefault();

    if (isArtist) {
      const artist = await Api.getArtistAlbums(item.id);
      const songs = artist.albums.map((a) => a.files).flat(Infinity);

      dispatch(
        pasteToPlaylist([...songs, ...artist.files] as EnrichedAlbumFile[]),
      );
    } else if (isAlbum) {
      const album = await Api.getAlbumById(getId(item));

      dispatch(pasteToPlaylist(album.files));
    }

    startX = 0;
    clearTimeout(timerRef.current);
    setIsLongTouch(false);
  };

  const renderFolderName = () =>
    isArtistAlbum(item, isAlbum) ? (
      <AlbumCover item={item} />
    ) : (
      <p>{item.name || "Unknown title"}</p>
    );

  const handleScroll = () => {
    const { scrollTop } = document.getElementById(
      "LibraryContainer",
    ) as HTMLElement;
    scrollPos = scrollTop;
  };

  useEffect(() => {
    const element = document.getElementById("LibraryContainer");

    if (element) {
      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const renderArtistsAndAlbums = () => (
    <Container
      ref={containerRef}
      isRoot={isArtist}
      draggable
      onDragStart={onDragStart}
      expand={showAnimation}
      albumsLen={albums.length}
      songsLen={songs.length}
      filesLen={files.length}
    >
      <Folder
        key={item.id}
        onClick={isArtist ? toggleAlbum : toggleSongs}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {renderFolderName()}
      </Folder>
      {showAlbums &&
        Array.isArray(albums) &&
        albums.length > 0 &&
        albums.map((album, i) => (
          <LibraryList key={album.id} item={album} isAlbum />
        ))}
      {showSongs &&
        Array.isArray(songs) &&
        songs.length > 0 &&
        songs.map((album) => (
          <LibraryList
            key={album.id}
            item={album}
            hasMultipleDisks={
              !(songs[songs.length - 1]?.track || "").startsWith("1")
            }
          />
        ))}
      {showAlbums &&
        files.length > 0 &&
        files.map((song, i) => (
          <LibraryItem key={`${song.name}-${i}`} item={song} />
        ))}
    </Container>
  );

  if (isArtist || isAlbum) {
    return renderArtistsAndAlbums();
  }

  return (
    <LibraryItem item={item} hasAlbum hasMultipleDisks={hasMultipleDisks} />
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch }),
)(LibraryList);
