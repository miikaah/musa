import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import TagInput from "./TagInput";
import TagTextarea from "./TagTextarea";
import Button from "./Button";
import Api from "api-client";
import { dispatchToast } from "../util";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 9fr;

  > span {
    align-self: center;
    padding-right: 20px;
  }

  > span:nth-of-type(1) {
    grid-row: 1;
  }

  > input {
    width: 100%;
  }

  > input:disabled {
    background-color: #f2f2f2;
  }
`;

const SaveButton = styled(Button)`
  align-self: flex-end;
  max-width: 200px;
  margin-top: 10px;
`;

const TagEditor = ({ files = [], dispatch }) => {
  const [artist, setArtist] = useState();
  const [title, setTitle] = useState();
  const [album, setAlbum] = useState();
  const [year, setYear] = useState();
  const [track, setTrack] = useState();
  const [tracks, setTracks] = useState();
  const [disk, setDisk] = useState();
  const [disks, setDisks] = useState();
  const [genre, setGenre] = useState();
  const [composer, setComposer] = useState();
  const [comment, setComment] = useState();

  const getCodecInfo = (file) => {
    const { codec, codecProfile, container } = file?.metadata || {};

    let str = "";
    if (codec) {
      str += codec;
      str += ", ";
    }
    if (codecProfile) {
      str += codecProfile;
      str += ", ";
    }
    if (container) {
      str += container;
    }

    return str;
  };

  const saveTags = async (event, file) => {
    const tags = {};

    if (typeof artist !== "undefined") {
      tags.artist = artist;
    }
    if (typeof title !== "undefined") {
      tags.title = title;
    }
    if (typeof album !== "undefined") {
      tags.album = album;
    }
    if (typeof year !== "undefined") {
      tags.year = year;
    }
    if (typeof track !== "undefined") {
      tags.trackNumber = track;
    }
    if (typeof tracks !== "undefined") {
      tags.trackNumber = `${tags.trackNumber || ""}/${tracks}`;
    }
    if (typeof disk !== "undefined") {
      tags.partOfSet = disk;
    }
    if (typeof disks !== "undefined") {
      const diskNo = tags.partOfSet || file?.metadata?.disk?.no || "";
      const diskOf = disks ? `/${disks}` : "";

      tags.partOfSet = `${diskNo}${diskOf}`;
    }
    if (typeof genre !== "undefined") {
      tags.genre = genre;
    }
    if (typeof composer !== "undefined") {
      tags.composer = composer;
    }
    if (typeof comment !== "undefined") {
      tags.comment = {
        language: "eng",
        text: comment,
      };
    }

    const err = await Api.writeTags(file.id, tags);

    if (err) {
      dispatchToast("Failed to update tags", "tag-update-failed", dispatch);
    }
  };

  return (
    <>
      <h3>Tag editor</h3>
      {files.map((file) => {
        const isDisabled = !(file?.metadata?.codec || "")
          .toLowerCase()
          .startsWith("mpeg");

        return (
          <Container key={file.id}>
            <Wrapper>
              <span>Artist</span>
              <TagInput
                field={file?.metadata?.artist || ""}
                updateValue={setArtist}
                isDisabled={isDisabled}
              />
              <span>Title</span>
              <TagInput
                field={file?.metadata?.title || ""}
                updateValue={setTitle}
                isDisabled={isDisabled}
              />
              <span>Album</span>
              <TagInput
                field={file?.metadata?.album || ""}
                updateValue={setAlbum}
                isDisabled={isDisabled}
              />
              <span>Year</span>
              <TagInput
                field={file?.metadata?.year || ""}
                updateValue={setYear}
                isDisabled={isDisabled}
              />
              <span>Track</span>
              <TagInput
                field={file?.metadata?.track?.no || ""}
                updateValue={setTrack}
                isDisabled={isDisabled}
              />
              <span>Tracks</span>
              <TagInput
                field={file?.metadata?.track?.of || ""}
                updateValue={setTracks}
                isDisabled={isDisabled}
              />
              <span>Disk</span>
              <TagInput
                field={file?.metadata?.disk?.no || ""}
                updateValue={setDisk}
                isDisabled={isDisabled}
              />
              <span>Disks</span>
              <TagInput
                field={file?.metadata?.disk?.of || ""}
                updateValue={setDisks}
                isDisabled={isDisabled}
              />
              <span>Genre</span>
              <TagInput
                field={(file?.metadata?.genre || []).join(", ")}
                updateValue={setGenre}
                isDisabled={isDisabled}
              />
              <span>Composer</span>
              <TagInput
                field={(file?.metadata?.composer || []).join(", ")}
                updateValue={setComposer}
                isDisabled={isDisabled}
              />
              <span>Codec</span>
              <TagInput field={getCodecInfo(file)} isDisabled />
              <span>Comment</span>
              <TagTextarea
                field={(file?.metadata?.comment || []).join(" ")}
                updateValue={setComment}
                isDisabled={isDisabled}
              />
            </Wrapper>
            <SaveButton onClick={(event) => saveTags(event, file)} isPrimary>
              Save
            </SaveButton>
          </Container>
        );
      })}
    </>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)(TagEditor);
