import { AudioWithMetadata, Tags } from "@miikaah/musa-core";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import EditorInput from "./EditorInput";
import EditorTextarea from "./EditorTextarea";
import Button from "../Button";
import * as Api from "../../apiClient";
import { dispatchToast, formatDuration } from "../../util";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import { ActionsContainer } from "../Modal/ActionsContainer";
import { getCodecInfo } from "./getCodecInfo";
import { ellipsisTextOverflow } from "../../common.styles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: 100%;
  padding-bottom: 80px;
`;

const sharedWrapperCss = css`
  margin: 10px auto 0;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 9fr;
  font-size: var(--font-size-xs);
  max-width: 600px;
  ${sharedWrapperCss}

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

const AllDetailsWrapper = styled.div`
  color: black;
  max-width: 96%;
  padding: 10px 10px 0;
  height: 55vh;
  background-color: #f6f6f6;
  border-radius: 1px;
  box-shadow:
    inset 1px 1px 2px rgba(0, 0, 0, 0.1),
    inset -1px -1px 2px rgba(255, 255, 255, 0.9);
  overflow: auto;
  font-size: var(--font-size-xs);
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(24px, 1fr));
  grid-template-columns: 3fr 17fr;
  ${sharedWrapperCss}

  > span {
    padding: 4px 0 0 8px;
    ${ellipsisTextOverflow}
  }

  > span:nth-of-type(2n) {
    font-size: var(--font-size-xxs);
  }

  > span:nth-of-type(2n + 1),
  > span:nth-of-type(2n + 2) {
    background-color: #f6f6f6;
  }

  > span:nth-of-type(4n + 1),
  > span:nth-of-type(4n + 2) {
    background-color: #eee;
  }
`;

const StyledActionsContainer = styled(ActionsContainer)`
  > div {
    > button:nth-of-type(1),
    > button:nth-of-type(2) {
      max-width: 120px;
      margin: 0 10px 10px 0;
      font-weight: normal;
    }
  }
`;

const SaveButton = styled(Button)`
  min-width: 170px !important;
  margin-bottom: 10px;
`;

const DetailsCheckboxWrapper = styled.div`
  color: black;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckboxWrapper = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px 0 0;

  ${({ isDisabled }) => isDisabled && `color: grey;`}
`;

const getFieldValuesString = (fieldValues: (string | number)[]) =>
  `${fieldValues.length > 1 ? `(${fieldValues.length}) ` : ""}${fieldValues.join(";")}`;

const resolveNumberOfMultiField = (
  combine: boolean,
  files: AudioWithMetadata[],
  index: number,
  fieldName: "track" | "disk",
  type: "no" | "of",
) => {
  const metadata = files[index].metadata;
  if (!combine || files.length === 1) {
    return metadata[fieldName]?.[type] ?? "";
  }
  const fieldValues = Array.from(
    new Set([
      ...files.flatMap((file) => file.metadata[fieldName]?.[type] ?? ""),
    ]),
  );
  return getFieldValuesString(fieldValues);
};

const resolveArrayMultiField = (
  combine: boolean,
  files: AudioWithMetadata[],
  index: number,
  fieldName: "genre" | "composer" | "comment",
) => {
  const metadata = files[index].metadata;
  if (!combine || files.length === 1) {
    return (metadata[fieldName] ?? []).join(", ");
  }
  const fieldValues = Array.from(
    new Set([
      ...files.flatMap((file) => (file.metadata[fieldName] ?? []).join(", ")),
    ]),
  );
  return getFieldValuesString(fieldValues);
};

const resolveMultiField = (
  combine: boolean,
  files: AudioWithMetadata[],
  index: number,
  fieldName: "artist" | "title" | "album" | "year",
) => {
  const metadata = files[index].metadata;
  if (!combine || files.length === 1) {
    return metadata[fieldName]?.toString() ?? "";
  }
  const fieldValues = Array.from(
    new Set([...files.map((file) => (file.metadata as any)[fieldName])]),
  );
  return getFieldValuesString(fieldValues);
};

type MetadataEditorProps = {
  activeIndex: number;
  files: AudioWithMetadata[];
  t: TranslateFn;
};

const MetadataEditor = ({
  activeIndex,
  files = [],
  t,
}: MetadataEditorProps) => {
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
  const [index, setIndex] = useState<number>(activeIndex);
  const [combine, setCombine] = useState(files.length > 1);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const dispatch = useDispatch();

  const saveTags = async (
    _event: React.MouseEvent,
    file: AudioWithMetadata,
  ) => {
    const tags: Partial<Tags> = {};

    if (artist !== undefined) {
      tags.artist = artist;
    }
    if (title !== undefined) {
      tags.title = title;
    }
    if (album !== undefined) {
      tags.album = album;
    }
    if (year !== undefined) {
      tags.year = year;
    }
    if (track !== undefined) {
      tags.trackNumber = track;
    }
    if (tracks !== undefined) {
      tags.trackNumber = `${tags.trackNumber || ""}/${tracks}`;
    }
    if (disk !== undefined) {
      tags.partOfSet = disk;
    }
    if (disks !== undefined) {
      const diskNo = tags.partOfSet || file?.metadata?.disk?.no || "";
      const diskOf = disks ? `/${disks}` : "";

      tags.partOfSet = `${diskNo}${diskOf}`;
    }
    if (genre !== undefined) {
      tags.genre = genre;
    }
    if (composer !== undefined) {
      tags.composer = composer;
    }
    if (comment !== undefined) {
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

  const previous = () => {
    setIndex(index - 1);
  };

  const next = () => {
    setIndex(index + 1);
  };

  return (
    <Container>
      {files.slice(index, index + 1).map((file) => {
        const isDisabled =
          !(file?.metadata?.codec || "").toLowerCase().startsWith("mpeg") &&
          !(file?.metadata?.codec || "").toLowerCase().startsWith("flac");
        console.log(file);
        console.log(file.metadata);

        return (
          <div key={file.id}>
            {!showAllDetails ? (
              <Wrapper>
                <span>{t("modal.metadata.tag.artist")}</span>
                <EditorInput
                  field={resolveMultiField(combine, files, index, "artist")}
                  updateValue={setArtist}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.title")}</span>
                <EditorInput
                  field={resolveMultiField(combine, files, index, "title")}
                  updateValue={setTitle}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.album")}</span>
                <EditorInput
                  field={resolveMultiField(combine, files, index, "album")}
                  updateValue={setAlbum}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.year")}</span>
                <EditorInput
                  field={resolveMultiField(combine, files, index, "year")}
                  updateValue={setYear}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.track")}</span>
                <EditorInput
                  field={resolveNumberOfMultiField(
                    combine,
                    files,
                    index,
                    "track",
                    "no",
                  )}
                  updateValue={setTrack}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.tracks")}</span>
                <EditorInput
                  field={resolveNumberOfMultiField(
                    combine,
                    files,
                    index,
                    "track",
                    "of",
                  )}
                  updateValue={setTracks}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.disk")}</span>
                <EditorInput
                  field={resolveNumberOfMultiField(
                    combine,
                    files,
                    index,
                    "disk",
                    "no",
                  )}
                  updateValue={setDisk}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.disks")}</span>
                <EditorInput
                  field={resolveNumberOfMultiField(
                    combine,
                    files,
                    index,
                    "disk",
                    "of",
                  )}
                  updateValue={setDisks}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.genre")}</span>
                <EditorInput
                  field={resolveArrayMultiField(combine, files, index, "genre")}
                  updateValue={setGenre}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.composer")}</span>
                <EditorInput
                  field={resolveArrayMultiField(
                    combine,
                    files,
                    index,
                    "composer",
                  )}
                  updateValue={setComposer}
                  isDisabled={isDisabled}
                />
                <span>{t("modal.metadata.tag.codec")}</span>
                <EditorInput
                  field={getCodecInfo(file).toLowerCase()}
                  isDisabled
                />
                <span>{t("modal.metadata.tag.comment")}</span>
                <EditorTextarea
                  field={resolveArrayMultiField(
                    combine,
                    files,
                    index,
                    "comment",
                  )}
                  updateValue={setComment}
                  isDisabled={isDisabled}
                />
              </Wrapper>
            ) : (
              <AllDetailsWrapper>
                <span>File URL</span>
                <span title={file.fileUrl?.replace("media:", "") ?? ""}>
                  {file.fileUrl?.replace("media:", "") ?? ""}
                </span>
                <span>Cover URL</span>
                <span title={file.coverUrl?.replace("media:", "") ?? ""}>
                  {file.coverUrl?.replace("media:", "") ?? ""}
                </span>
                <span>Duration</span>
                <span>{formatDuration(file.metadata.duration)}</span>
                <span>Sample rate</span>
                <span>
                  {file.metadata.sampleRate
                    ? `${file.metadata.sampleRate} Hz`
                    : ""}
                </span>
                <span>Bit rate</span>
                <span>
                  {file.metadata.bitrate
                    ? `${file.metadata.bitrate / 1000} kbps`
                    : ""}
                </span>
                <span>Channels</span>
                <span>{file.metadata.numberOfChannels ?? ""}</span>
                <span title="Codec, profile, container">Codec</span>
                <span>{getCodecInfo(file)}</span>
                <span>Tag types</span>
                <span>
                  {(file.metadata.tagTypes || []).length
                    ? file.metadata.tagTypes?.join(", ")
                    : ""}
                </span>
                <span>Encoding</span>
                <span>{file.metadata.lossless ? "lossless" : "lossy"}</span>
                <span>Encoder</span>
                <span>{file.metadata.tool ?? ""}</span>
                <span>Encoder settings</span>
                <span title={file.metadata.encoderSettings ?? ""}>
                  {file.metadata.encoderSettings ?? ""}
                </span>
                <span title="Dynamic range track">DR track</span>
                <span>
                  {file.metadata.dynamicRange
                    ? `${file.metadata.dynamicRange} dB`
                    : ""}
                </span>
                <span title="Dynamic range album">DR album</span>
                <span>
                  {file.metadata.dynamicRangeAlbum
                    ? `${file.metadata.dynamicRangeAlbum} dB`
                    : ""}
                </span>
                <span title="Normalization track">N track</span>
                <span>
                  {file.metadata.replayGainTrackGain?.dB
                    ? `${file.metadata.replayGainTrackGain?.dB} dB`
                    : ""}
                </span>
                <span title="Normalization album">N album</span>
                <span>
                  {file.metadata.replayGainAlbumGain?.dB
                    ? `${file.metadata.replayGainAlbumGain?.dB} dB`
                    : ""}
                </span>
              </AllDetailsWrapper>
            )}
            <StyledActionsContainer>
              <div></div>
              <div>
                <DetailsCheckboxWrapper>
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      id="metadataEditorAllDetails"
                      checked={showAllDetails}
                      onChange={(event) =>
                        setShowAllDetails(event.target.checked)
                      }
                    />
                    <label htmlFor="metadataEditorAllDetails">
                      {t("modal.metadata.allDetailsLabel")}
                    </label>
                  </CheckboxWrapper>
                  <CheckboxWrapper isDisabled={files.length < 2}>
                    <input
                      type="checkbox"
                      id="metadataEditorCombine"
                      checked={combine}
                      onChange={(event) => setCombine(event.target.checked)}
                      disabled={files.length < 2}
                    />
                    <label htmlFor="metadataEditorCombine">
                      {t("modal.metadata.combineLabel")}
                    </label>
                  </CheckboxWrapper>
                </DetailsCheckboxWrapper>
                <Button
                  isSmall
                  isSecondary
                  onClick={previous}
                  disabled={index < 1}
                >
                  {t("modal.metadata.previousButton")}
                </Button>
                <Button
                  isSmall
                  isSecondary
                  onClick={next}
                  disabled={index >= files.length - 1}
                >
                  {t("modal.metadata.nextButton")}
                </Button>
                <SaveButton
                  onClick={(event: React.MouseEvent) => saveTags(event, file)}
                  isPrimary
                  disabled={files.length > 1 || isUpdating}
                >
                  {`${t("modal.metadata.saveButton")}${files.length > 1 ? ` (${files.length})` : ""}`}
                </SaveButton>
              </div>
            </StyledActionsContainer>
          </div>
        );
      })}
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(MetadataEditor);
