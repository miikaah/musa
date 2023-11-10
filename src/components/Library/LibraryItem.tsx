import { AlbumWithFilesAndMetadata, Artist } from "@miikaah/musa-core";
import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { addToPlaylist } from "../../reducers/player.reducer";
import { isElectron } from "../../config";
import Api from "../../apiClient";
import { breakpoints } from "../../breakpoints";
import { Dispatch } from "redux";

const Container = styled.li`
  position: relative;
`;

const Title = styled.p<{ isFirstOfDisk?: boolean; hasAlbum?: boolean }>`
  cursor: pointer;
  padding-top: ${({ isFirstOfDisk }) => isFirstOfDisk && "12px"};
  padding-left: ${({ hasAlbum }) => (hasAlbum ? 90 : 24)}px;
  font-size: var(--font-size-xs);
  letter-spacing: -0.4px;
  margin: 0;
`;

const DiskNumber = styled.div<{ isFirstOfFirstDisk: boolean }>`
  position: absolute;
  top: ${({ isFirstOfFirstDisk }) => (isFirstOfFirstDisk ? 10 : 6)}px;
  left: 26px;
  padding: 8px 9px;
  font-size: 11px;
`;

let startX = 0;
let hasDragged = false;
let startScrollPos = 0;
let scrollPos = 0;

type LibraryListItem =
  | Artist["albums"][0]
  | AlbumWithFilesAndMetadata["files"][0];

type LibraryItemProps = {
  item: LibraryListItem;
  hasAlbum?: boolean;
  hasMultipleDisks?: boolean;
  dispatch: Dispatch;
};

const getId = (item: LibraryListItem): string => {
  return isElectron ? item.id : item.url || "";
};

const isAlbumFile = (
  item: LibraryListItem,
): item is AlbumWithFilesAndMetadata["files"][0] => {
  return "track" in item;
};

const LibraryItem = ({
  item,
  hasAlbum,
  hasMultipleDisks,
  dispatch,
}: LibraryItemProps) => {
  const [isLongTouch, setIsLongTouch] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ item }));
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

    const audio = await Api.getAudioById(getId(item));

    dispatch(addToPlaylist(audio));

    startX = 0;
    clearTimeout(timerRef.current);
    setIsLongTouch(false);
  };

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

  const isFirstOfDisk = new RegExp(/^\d\.01|^\d\.001|^\d\.0001/).test(
    isAlbumFile(item) ? item?.track : "",
  );
  const isFirstOfFirstDisk = new RegExp(/^1\.01|^1\.001|^1\.0001/).test(
    isAlbumFile(item) ? item?.track : "",
  );
  const title = isAlbumFile(item)
    ? item?.metadata?.title
    : item.name || "Unnamed file";
  const diskNo = isAlbumFile(item) ? item?.metadata?.disk?.no : "";

  return (
    <Container
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {hasMultipleDisks && isFirstOfDisk && (
        <DiskNumber isFirstOfFirstDisk={isFirstOfFirstDisk}>
          {`${diskNo}.`}
        </DiskNumber>
      )}
      <Title
        hasAlbum={hasAlbum}
        draggable
        onDragStart={onDragStart}
        onDoubleClick={() => dispatch(addToPlaylist(item))}
        isFirstOfDisk={hasMultipleDisks && isFirstOfDisk}
      >
        {title}
      </Title>
    </Container>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch }),
)(LibraryItem);
