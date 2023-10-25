import React, { useState, useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import { addToPlaylist } from "reducers/player.reducer";
import config from "config";
import Api from "apiClient";
import { breakpoints } from "../breakpoints";

const { isElectron } = config;

const Container = styled.li`
  position: relative;
`;

const Title = styled.p`
  cursor: pointer;
  padding-top: ${({ isFirstOfDisk }) => isFirstOfDisk && "12px"};
  padding-left: ${({ hasAlbum }) => (hasAlbum ? 90 : 24)}px;
  font-size: var(--font-size-xs);
  letter-spacing: -0.4px;
  margin: 0;
`;

const DiskNumber = styled.div`
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

const LibraryItem = ({ item, hasAlbum, hasMultipleDisks }) => {
  const [isLongTouch, setIsLongTouch] = useState(false);

  const dispatch = useDispatch();

  const timerRef = useRef(null);

  const onDragStart = (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ item }));
    event.stopPropagation();
  };

  const onTouchStart = (event) => {
    hasDragged = false;
    startX = event.touches[0].clientX;

    if (window.innerWidth < breakpoints.sm) {
      timerRef.current = setTimeout(() => {
        setIsLongTouch(true);
      }, 500);

      const { scrollTop } = document.getElementById("LibraryContainer");
      startScrollPos = scrollTop;
      scrollPos = scrollTop;
    }
  };

  const onTouchMove = (event) => {
    const deltaX = event.touches[0].clientX - startX;

    if (Math.abs(deltaX) > 100) {
      hasDragged = true;
    }
  };

  const onTouchEnd = async (event) => {
    if ((!hasDragged && !isLongTouch) || startScrollPos !== scrollPos) {
      startX = 0;
      clearTimeout(timerRef.current);
      setIsLongTouch(false);
      return;
    }
    event.preventDefault();

    const audio = await Api.getAudioById(isElectron ? item.id : item.url);

    dispatch(addToPlaylist(audio));

    startX = 0;
    clearTimeout(timerRef.current);
    setIsLongTouch(false);
  };

  const handleScroll = () => {
    const { scrollTop } = document.getElementById("LibraryContainer");
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
    item?.track,
  );
  const isFirstOfFirstDisk = new RegExp(/^1\.01|^1\.001|^1\.0001/).test(
    item?.track,
  );
  const title = item?.metadata?.title || item.name || "Unnamed file";
  const diskNo = item?.metadata?.disk?.no || "";

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
