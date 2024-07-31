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

type MetadataField = {
  value: string | null;
  multiValue: (string | number)[];
  isTouched: boolean;
};

type MetadataFields = {
  artist: MetadataField;
  title: MetadataField;
  album: MetadataField;
  year: MetadataField;
  track: MetadataField;
  tracks: MetadataField;
  disk: MetadataField;
  disks: MetadataField;
  genre: MetadataField;
  composer: MetadataField;
  comment: MetadataField;
};

const defaultField = {
  value: null,
  multiValue: [],
  isTouched: false,
};

const defaultFields = {
  artist: defaultField,
  title: defaultField,
  album: defaultField,
  year: defaultField,
  track: defaultField,
  tracks: defaultField,
  disk: defaultField,
  disks: defaultField,
  genre: defaultField,
  composer: defaultField,
  comment: defaultField,
};

const resolveNumberOfMultiField = (
  files: AudioWithMetadata[],
  index: number,
  fields: MetadataFields,
  fieldName: "track" | "disk",
  type: "no" | "of",
): MetadataField => {
  const metadata = files[index].metadata;
  const field = type === "of" ? fields[`${fieldName}s`] : fields[fieldName];

  return {
    value: field.value ?? metadata[fieldName]?.[type]?.toString() ?? "",
    multiValue:
      field.multiValue.length > 1
        ? field.multiValue
        : Array.from(
            new Set([
              ...files.map((file) => file.metadata[fieldName]?.[type] ?? ""),
            ]),
          ),
    isTouched: field.isTouched,
  };
};

const resolveArrayMultiField = (
  files: AudioWithMetadata[],
  index: number,
  fields: MetadataFields,
  fieldName: "genre" | "composer" | "comment",
): MetadataField => {
  const metadata = files[index].metadata;
  const field = fields[fieldName];

  return {
    value: field.value ?? (metadata[fieldName] ?? []).join(", "),
    multiValue:
      field.multiValue.length > 0
        ? field.multiValue
        : Array.from(
            new Set([
              ...files.flatMap((file) =>
                (file.metadata[fieldName] || []).join(", "),
              ),
            ]),
          ),
    isTouched: field.isTouched,
  };
};

const resolveMultiField = (
  files: AudioWithMetadata[],
  index: number,
  fields: MetadataFields,
  fieldName: "artist" | "title" | "album" | "year",
): MetadataField => {
  const metadata = files[index].metadata;
  const field = fields[fieldName];

  return {
    value: field.value ?? metadata[fieldName]?.toString() ?? "",
    multiValue:
      field.multiValue.length > 1
        ? field.multiValue
        : Array.from(
            new Set([...files.map((file) => file.metadata[fieldName] ?? "")]),
          ),
    isTouched: field.isTouched,
  };
};

const resolveFields = (
  files: AudioWithMetadata[],
  i: number,
  fields: MetadataFields,
) => ({
  artist: resolveMultiField(files, i, fields, "artist"),
  album: resolveMultiField(files, i, fields, "album"),
  title: resolveMultiField(files, i, fields, "title"),
  year: resolveMultiField(files, i, fields, "year"),
  track: resolveNumberOfMultiField(files, i, fields, "track", "no"),
  tracks: resolveNumberOfMultiField(files, i, fields, "track", "of"),
  disk: resolveNumberOfMultiField(files, i, fields, "disk", "no"),
  disks: resolveNumberOfMultiField(files, i, fields, "disk", "of"),
  genre: resolveArrayMultiField(files, i, fields, "genre"),
  composer: resolveArrayMultiField(files, i, fields, "composer"),
  comment: resolveArrayMultiField(files, i, fields, "comment"),
});

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
  const [fields, setFields] = useState<MetadataFields[]>(
    files.map((_, i) => resolveFields(files, i, defaultFields)),
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const dispatch = useDispatch();

  const toUpdatePayload = (file: AudioWithMetadata, idx: number) => {
    const item = { ...file };
    const tags: Partial<Tags> = {};

    if (fields[idx].artist.isTouched) {
      const value = fields[idx].artist.value ?? "";
      tags.artist = value;
      item.metadata.artist = value;
    }
    if (fields[idx].title.isTouched) {
      const value = fields[idx].title.value ?? "";
      tags.title = value;
      item.metadata.title = value;
    }
    if (fields[idx].album.isTouched) {
      const value = fields[idx].album.value ?? "";
      tags.album = value;
      item.metadata.album = value;
    }
    if (fields[idx].year.isTouched) {
      const value = fields[idx].year.value ?? "";
      tags.year = value;
      item.metadata.year = value;
    }
    if (fields[idx].track.isTouched) {
      const value = fields[idx].track.value ?? "";
      tags.trackNumber = value;
      item.metadata.track = { no: value, of: "" };
    }
    if (fields[idx].tracks.isTouched) {
      tags.trackNumber = `${tags.trackNumber || ""}/${fields[idx].tracks.value ?? ""}`;
      item.metadata.track = {
        no: item.metadata.track?.no ? item.metadata.track.no : "",
        of: fields[idx].tracks.value,
      };
    }
    if (fields[idx].disk.isTouched) {
      const value = fields[idx].disk.value ?? "";
      tags.partOfSet = value;
      item.metadata.disk = { no: value, of: "" };
    }
    if (fields[idx].disks.isTouched) {
      const diskNo = tags.partOfSet || file?.metadata?.disk?.no || "";
      const diskOf = fields[idx].disks.value
        ? `/${fields[idx].disks.value}`
        : "";

      tags.partOfSet = `${diskNo}${diskOf}`;
      item.metadata.disk = {
        no: item.metadata.disk?.no ? item.metadata.disk.no : "",
        of: fields[idx].disks.value,
      };
    }
    if (fields[idx].genre.isTouched) {
      const value = fields[idx].genre.value ?? "";
      tags.genre = value;
      item.metadata.genre = value.split(",").map((it) => it.trim());
    }
    if (fields[idx].composer.isTouched) {
      const value = fields[idx].composer.value ?? "";
      tags.composer = value;
      item.metadata.composer = value.split(",").map((it) => it.trim());
    }
    if (fields[idx].comment.isTouched) {
      const value = fields[idx].comment.value ?? "";
      tags.comment = {
        language: "eng",
        text: value,
      };
      item.metadata.comment = value.split(",").map((it) => it.trim());
    }

    return { tags, item };
  };

  const saveTags = async (file: AudioWithMetadata) => {
    if (combine) {
      const payload = files.map((file, i) => toUpdatePayload(file, i));
      console.log("payload", payload);
      // TODO: Create bulk file tag update API
    } else {
      const { tags, item } = toUpdatePayload(files[index], index);

      setIsUpdating(true);
      const err = await Api.writeTags(
        urlSafeBase64.encode(file.fileUrl?.replace("media:/", "") ?? ""),
        tags,
      );
      setIsUpdating(false);
      if (err) {
        // TODO: Show error to user
        console.error("Failed to update tags", err);
        return;
      }

      dispatch(updateManyById([item]));
    }
  };

  const toggleCombinedFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    const combine = event.target.checked;
    const newFields = fields;
    newFields[index] = resolveFields(files, index, fields[index]);
    setCombine(combine);
    setFields(newFields);
  };

  const updateValue = (valueArr: string[], key: keyof MetadataFields) => {
    // Have to do a deep copy here to sever the ref between the objects in the fields array
    const prevFields: MetadataFields[] = JSON.parse(JSON.stringify(fields));
    const newFields: MetadataFields[] = JSON.parse(JSON.stringify(fields));

    for (let i = 0; i < files.length; i++) {
      const value = valueArr[i];
      const isTouched =
        prevFields[i][key].isTouched || prevFields[i][key].value !== value;

      if (combine) {
        newFields[i][key].value = value ?? "";
        newFields[i][key].multiValue = valueArr;
        newFields[i][key].isTouched = isTouched;
      } else if (value) {
        newFields[i][key].value = value;
        newFields[i][key].multiValue[i] = value;
        newFields[i][key].isTouched = isTouched;
      }
    }
    setFields(newFields);
  };

  const previous = () => {
    const newIndex = index - 1;
    const newFields: MetadataFields[] = JSON.parse(JSON.stringify(fields));
    newFields[newIndex] = resolveFields(files, newIndex, newFields[newIndex]);
    setFields(newFields);
    setIndex(newIndex);
  };

  const next = () => {
    const newIndex = index + 1;
    const newFields: MetadataFields[] = JSON.parse(JSON.stringify(fields));
    newFields[newIndex] = resolveFields(files, newIndex, newFields[newIndex]);
    setFields(newFields);
    setIndex(newIndex);
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
                {fieldKeys.map((key) => {
                  const field = { ...fields[index][key] };

                  return (
                    <React.Fragment key={key}>
                      <span>{t(`modal.metadata.tag.${key}`)}</span>
                      <EditorInput
                        field={(combine ? field.multiValue : field.value) ?? ""}
                        updateValue={(value) => updateValue(value, key)}
                        isDisabled={isDisabled}
                      />
                    </React.Fragment>
                  );
                })}
                <span>{t("modal.metadata.tag.codec")}</span>
                <EditorInput
                  field={getCodecInfo(file).toLowerCase()}
                  isDisabled
                />
                <span>{t("modal.metadata.tag.comment")}</span>
                <EditorTextarea
                  field={
                    (combine
                      ? fields[index].comment.multiValue
                      : fields[index].comment.value) ?? ""
                  }
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
                      onChange={toggleCombinedFields}
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
                  disabled={index < 1 || combine}
                >
                  {t("modal.metadata.previousButton")}
                </Button>
                <Button
                  isSmall
                  isSecondary
                  onClick={next}
                  disabled={index >= files.length - 1 || combine}
                >
                  {t("modal.metadata.nextButton")}
                </Button>
                <SaveButton
                  onClick={() => saveTags(file)}
                  isPrimary
                  disabled={isUpdating}
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
