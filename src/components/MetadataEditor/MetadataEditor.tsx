import { AudioWithMetadata, Tags } from "@miikaah/musa-core";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import EditorInput from "./EditorInput";
import EditorTextarea from "./EditorTextarea";
import Button from "../Button";
import * as Api from "../../apiClient";
import { formatDuration, urlSafeBase64 } from "../../util";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import { ActionsContainer } from "../Modal/ActionsContainer";
import { getCodecInfo } from "./getCodecInfo";
import { ellipsisTextOverflow } from "../../common.styles";
import { updateManyById } from "../../reducers/player.reducer";

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
): string => {
  const metadata = files[index].metadata;
  if (!combine || files.length === 1) {
    return String(metadata[fieldName]?.[type] ?? "");
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
): string => {
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
): string => {
  const metadata = files[index].metadata;
  if (!combine || files.length === 1) {
    return metadata[fieldName]?.toString() ?? "";
  }
  const fieldValues = Array.from(
    new Set([...files.map((file) => (file.metadata as any)[fieldName])]),
  );
  return getFieldValuesString(fieldValues);
};

const resolveFields = (
  combine: boolean,
  files: AudioWithMetadata[],
  index: number,
) => ({
  artist: resolveMultiField(combine, files, index, "artist"),
  album: resolveMultiField(combine, files, index, "album"),
  title: resolveMultiField(combine, files, index, "title"),
  year: resolveMultiField(combine, files, index, "year"),
  track: resolveNumberOfMultiField(combine, files, index, "track", "no"),
  tracks: resolveNumberOfMultiField(combine, files, index, "track", "of"),
  disk: resolveNumberOfMultiField(combine, files, index, "disk", "no"),
  disks: resolveNumberOfMultiField(combine, files, index, "disk", "of"),
  genre: resolveArrayMultiField(combine, files, index, "genre"),
  composer: resolveArrayMultiField(combine, files, index, "composer"),
  comment: resolveArrayMultiField(combine, files, index, "comment"),
});

type MetadataFields = {
  artist: string;
  title: string;
  album: string;
  year: string;
  track: string;
  tracks: string;
  disk: string;
  disks: string;
  genre: string;
  composer: string;
  comment: string;
};

const fieldKeys: (keyof MetadataFields)[] = [
  "artist",
  "title",
  "album",
  "year",
  "track",
  "tracks",
  "disk",
  "disks",
  "genre",
  "composer",
];

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
  const [index, setIndex] = useState<number>(activeIndex);
  const [combine, setCombine] = useState(files.length > 1);
  const [fields, setFields] = useState<MetadataFields>(
    resolveFields(combine, files, index),
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const dispatch = useDispatch();

  const saveTags = async (file: AudioWithMetadata) => {
    const item = { ...file };
    const tags: Partial<Tags> = {};

    if (fields.artist !== undefined) {
      tags.artist = fields.artist;
      item.metadata.artist = fields.artist;
    }
    if (fields.title !== undefined) {
      tags.title = fields.title;
      item.metadata.title = fields.title;
    }
    if (fields.album !== undefined) {
      tags.album = fields.album;
      item.metadata.album = fields.album;
    }
    if (fields.year !== undefined) {
      tags.year = fields.year;
      item.metadata.year = fields.year;
    }
    if (fields.track !== undefined) {
      tags.trackNumber = fields.track;
      item.metadata.track = { no: fields.track, of: "" };
    }
    if (fields.tracks !== undefined) {
      tags.trackNumber = `${tags.trackNumber || ""}/${fields.tracks}`;
      item.metadata.track = {
        no: item.metadata.track?.no ? item.metadata.track.no : "",
        of: fields.tracks,
      };
    }
    if (fields.disk !== undefined) {
      tags.partOfSet = fields.disk;
      item.metadata.disk = { no: fields.disk, of: "" };
    }
    if (fields.disks !== undefined) {
      const diskNo = tags.partOfSet || file?.metadata?.disk?.no || "";
      const diskOf = fields.disks ? `/${fields.disks}` : "";

      tags.partOfSet = `${diskNo}${diskOf}`;
      item.metadata.disk = {
        no: item.metadata.disk?.no ? item.metadata.disk.no : "",
        of: fields.disks,
      };
    }
    if (fields.genre !== undefined) {
      tags.genre = fields.genre;
      item.metadata.genre = fields.genre.split(",").map((it) => it.trim());
    }
    if (fields.composer !== undefined) {
      tags.composer = fields.composer;
      item.metadata.composer = fields.composer
        .split(",")
        .map((it) => it.trim());
    }
    if (fields.comment !== undefined) {
      tags.comment = {
        language: "eng",
        text: fields.comment,
      };
      item.metadata.comment = fields.comment.split(",").map((it) => it.trim());
    }

    setIsUpdating(true);
    const err = await Api.writeTags(
      urlSafeBase64.encode(file.fileUrl?.replace("media:/", "") ?? ""),
      tags,
    );
    setIsUpdating(false);

    if (err) {
      console.error("Failed to update tags", err);
      return;
    }

    dispatch(updateManyById([item]));
  };

  const resetFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    const combine = event.target.checked;
    setCombine(event.target.checked);
    setFields(resolveFields(combine, files, index));
  };

  const updateValue = (value: string, key: keyof MetadataFields) => {
    const newFields = { ...fields };
    newFields[key] = value;
    setFields(newFields);
  };

  const previous = () => {
    const newIndex = index - 1;
    setIndex(newIndex);
    setFields(resolveFields(combine, files, newIndex));
  };

  const next = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    setFields(resolveFields(combine, files, newIndex));
  };

  return (
    <Container>
      {files.slice(index, index + 1).map((file) => {
        const isDisabled =
          !(file?.metadata?.codec || "").toLowerCase().startsWith("mpeg") &&
          !(file?.metadata?.codec || "").toLowerCase().startsWith("flac");

        return (
          <div key={file.id}>
            {!showAllDetails ? (
              <Wrapper>
                {fieldKeys.map((key) => (
                  <React.Fragment key={key}>
                    <span>{t(`modal.metadata.tag.${key}`)}</span>
                    <EditorInput
                      field={fields[key]}
                      updateValue={(value) => updateValue(value, key)}
                      isDisabled={isDisabled}
                    />
                  </React.Fragment>
                ))}
                <span>{t("modal.metadata.tag.codec")}</span>
                <EditorInput
                  field={getCodecInfo(file).toLowerCase()}
                  isDisabled
                />
                <span>{t("modal.metadata.tag.comment")}</span>
                <EditorTextarea
                  field={fields.comment}
                  updateValue={(value) => updateValue(value, "comment")}
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
                      onChange={resetFields}
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
                  onClick={() => saveTags(file)}
                  isPrimary
                  disabled={combine || isUpdating}
                >
                  {`${t("modal.metadata.saveButton")}${files.length > 1 && combine ? ` (${files.length})` : ""}`}
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
