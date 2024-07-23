import { AudioWithMetadata, Tags } from "@miikaah/musa-core";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import EditorInput from "./EditorInput";
import EditorTextarea from "./EditorTextarea";
import Button from "../Button";
import * as Api from "../../apiClient";
import { dispatchToast } from "../../util";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import { ActionsContainer } from "../Modal/ActionsContainer";
import { getCodecInfo } from "./getCodecInfo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: 100%;
  padding-bottom: 80px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 9fr;
  font-size: var(--font-size-xs);
  margin: 10px auto;
  max-width: 600px;

  > span {
    align-self: center;
    padding: 0 20px;
    color: black;
  }

  > span:nth-of-type(1) {
    grid-row: 1;
  }

  > input,
  > textarea {
    width: 97.5%;
    border-radius: 0;
    border-width: 1px 0 2px 0;
    border-top-color: transparent;
    border-bottom-color: var(--color-primary-highlight);
    font-size: var(--font-size-xs);
    padding: 10px;
    outline: none;
  }

  > input::selection,
  > textarea::selection {
    background: var(--color-primary-highlight);
    color: var(--color-typography-primary);
  }

  > input:focus,
  > textarea:focus {
    border-bottom-color: red;
  }

  > textarea {
    resize: none;
  }

  > input:disabled,
  > textarea:disabled {
    background-color: #f2f2f2;
    border-bottom-color: #f2f2f2;
  }
`;

const StyledActionsContainer = styled(ActionsContainer)`
  > button:first-of-type,
  > button:last-of-type {
    padding: 0;
    max-width: 120px;
    margin-top: 16px;
    font-weight: normal;
  }
`;

const SaveButton = styled(Button)`
  align-self: flex-end;
  max-width: 200px;
  margin-top: 10px;
`;

type MetadataEditorProps = {
  files: AudioWithMetadata[];
  offset?: number;
  t: TranslateFn;
};

const MetadataEditor = ({ files = [], offset = 0, t }: MetadataEditorProps) => {
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
  const [index, setIndex] = useState<number>(0);
  const dispatch = useDispatch();

  const saveTags = async (
    _event: React.MouseEvent,
    file: AudioWithMetadata,
  ) => {
    const tags: Partial<Tags> = {};

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
    <Container>
      {files.slice(index, 1).map((file) => {
        const isDisabled =
          !(file?.metadata?.codec || "").toLowerCase().startsWith("mpeg") &&
          !(file?.metadata?.codec || "").toLowerCase().startsWith("flac");

        return (
          <>
            <Wrapper key={file.id}>
              <span>{t("modal.metadata.tag.artist")}</span>
              <EditorInput
                field={file?.metadata?.artist || ""}
                updateValue={setArtist}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.title")}</span>
              <EditorInput
                field={file?.metadata?.title || ""}
                updateValue={setTitle}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.album")}</span>
              <EditorInput
                field={file?.metadata?.album || ""}
                updateValue={setAlbum}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.year")}</span>
              <EditorInput
                field={file?.metadata?.year || ""}
                updateValue={setYear}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.track")}</span>
              <EditorInput
                field={file?.metadata?.track?.no || ""}
                updateValue={setTrack}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.tracks")}</span>
              <EditorInput
                field={file?.metadata?.track?.of || ""}
                updateValue={setTracks}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.disk")}</span>
              <EditorInput
                field={file?.metadata?.disk?.no || ""}
                updateValue={setDisk}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.disks")}</span>
              <EditorInput
                field={file?.metadata?.disk?.of || ""}
                updateValue={setDisks}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.genre")}</span>
              <EditorInput
                field={(file?.metadata?.genre || []).join(", ")}
                updateValue={setGenre}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.composer")}</span>
              <EditorInput
                field={(file?.metadata?.composer || []).join(", ")}
                updateValue={setComposer}
                isDisabled={isDisabled}
              />
              <span>{t("modal.metadata.tag.codec")}</span>
              <EditorInput field={getCodecInfo(file)} isDisabled />
              <span>{t("modal.metadata.tag.comment")}</span>
              <EditorTextarea
                field={(file?.metadata?.comment || []).join(" ")}
                updateValue={setComment}
                isDisabled={isDisabled}
              />
            </Wrapper>
            <StyledActionsContainer>
              <Button isSmall isSecondary onClick={() => undefined}>
                {t("modal.metadata.previousButton")}
              </Button>
              <SaveButton
                onClick={(event: React.MouseEvent) => saveTags(event, file)}
                isPrimary
                disabled={isUpdating}
              >
                {t("modal.metadata.saveButton")}
              </SaveButton>
              <Button isSmall isSecondary onClick={() => undefined}>
                {t("modal.metadata.nextButton")}
              </Button>
            </StyledActionsContainer>
          </>
        );
      })}
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(MetadataEditor);
