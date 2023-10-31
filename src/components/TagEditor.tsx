import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import TagInput from "./TagInput";
import TagTextarea from "./TagTextarea";
import Button from "./Button";
import Api from "../apiClient";
import { dispatchToast } from "../util";
import { ellipsisTextOverflow } from "../common.styles";
import { SettingsState } from "../reducers/settings.reducer";
import { AudioWithMetadata } from "@miikaah/musa-core";
import { TranslateFn } from "../i18n";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Filename = styled.div`
  margin-bottom: 20px;
  ${ellipsisTextOverflow}
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
    border-style: solid;
  }

  > input:disabled,
  > textarea:disabled {
    background-color: #f2f2f2;
  }
`;

const SaveButton = styled(Button)`
  align-self: flex-end;
  max-width: 200px;
  margin-top: 10px;
`;

type Tags = Partial<{
  artist: string;
  title: string;
  album: string;
  year: string;
  trackNumber: string;
  partOfSet: string;
  genre: string;
  composer: string;
  comment: {
    language: string;
    text: string;
  };
}>;

type TagEditorProps = {
  files: AudioWithMetadata[];
  t: TranslateFn;
  dispatch: Dispatch;
};

const TagEditor = ({ files = [], t, dispatch }: TagEditorProps) => {
  const [artist, setArtist] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [album, setAlbum] = useState<string>();
  const [year, setYear] = useState<string>();
  const [track, setTrack] = useState<string>();
  const [tracks, setTracks] = useState<string>();
  const [disk, setDisk] = useState<string>();
  const [disks, setDisks] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [composer, setComposer] = useState<string>();
  const [comment, setComment] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);

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
    const tags: Tags = {};

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

    setIsUpdating(true);
    const err = await Api.writeTags(file.id, tags);
    setIsUpdating(false);

    if (err) {
      dispatchToast(
        t("toast.failedToUpdateTags"),
        `tag-update-failure-${Date.now()}`,
        dispatch,
      );
    } else {
      dispatchToast(
        t("toast.succeededToUpdateTags"),
        `tag-update-success-${Date.now()}`,
        dispatch,
      );
    }
  };

  return (
    <>
      <h3>{t("tagEditor.title")}</h3>
      {files.map((file) => {
        const isDisabled =
          !(file?.metadata?.codec || "").toLowerCase().startsWith("mpeg") &&
          !(file?.metadata?.codec || "").toLowerCase().startsWith("flac");

        return (
          <Container key={file.id}>
            <Filename>
              {file.fileUrl?.replace("media:\\", "").replace("media:/", "")}
            </Filename>
            <Wrapper>
              <span>{t("tagEditor.tag.artist")}</span>
              <TagInput
                field={file?.metadata?.artist || ""}
                updateValue={setArtist}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.title")}</span>
              <TagInput
                field={file?.metadata?.title || ""}
                updateValue={setTitle}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.album")}</span>
              <TagInput
                field={file?.metadata?.album || ""}
                updateValue={setAlbum}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.year")}</span>
              <TagInput
                field={file?.metadata?.year || ""}
                updateValue={setYear}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.track")}</span>
              <TagInput
                field={file?.metadata?.track?.no || ""}
                updateValue={setTrack}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.tracks")}</span>
              <TagInput
                field={file?.metadata?.track?.of || ""}
                updateValue={setTracks}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.disk")}</span>
              <TagInput
                field={file?.metadata?.disk?.no || ""}
                updateValue={setDisk}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.disks")}</span>
              <TagInput
                field={file?.metadata?.disk?.of || ""}
                updateValue={setDisks}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.genre")}</span>
              <TagInput
                field={(file?.metadata?.genre || []).join(", ")}
                updateValue={setGenre}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.composer")}</span>
              <TagInput
                field={(file?.metadata?.composer || []).join(", ")}
                updateValue={setComposer}
                isDisabled={isDisabled}
              />
              <span>{t("tagEditor.tag.codec")}</span>
              <TagInput field={getCodecInfo(file)} isDisabled />
              <span>{t("tagEditor.tag.comment")}</span>
              <TagTextarea
                field={(file?.metadata?.comment || []).join(" ")}
                updateValue={setComment}
                isDisabled={isDisabled}
              />
            </Wrapper>
            <SaveButton
              onClick={(event: React.MouseEvent) => saveTags(event, file)}
              isPrimary
              disabled={isUpdating}
            >
              {t("tagEditor.saveButton")}
            </SaveButton>
          </Container>
        );
      })}
    </>
  );
};

export default connect(
  (state: { settings: SettingsState }) => ({
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(TagEditor);
