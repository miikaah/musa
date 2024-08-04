import { AudioWithMetadata, Tags } from "@miikaah/musa-core";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import EditorInput from "./EditorInput";
import EditorTextarea from "./EditorTextarea";
import Button from "../Button";
import * as Api from "../../apiClient";
import { formatDuration, prefixNumber, urlSafeBase64 } from "../../util";
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
  grid-template-columns: 4fr 16fr;
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
  multiValue: string[];
  isTouched: boolean[];
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

const defaultField: MetadataField = {
  multiValue: [],
  isTouched: [],
};

const defaultFields: MetadataFields = {
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
  fields: MetadataFields,
  fieldName: "track" | "disk",
  type: "no" | "of",
): MetadataField => {
  const field = type === "of" ? fields[`${fieldName}s`] : fields[fieldName];

  return {
    multiValue:
      field.multiValue.length > 0
        ? field.multiValue
        : files.map(
            (file) => file.metadata?.[fieldName]?.[type]?.toString() ?? "",
          ),
    isTouched:
      field.isTouched.length > 0 ? field.isTouched : files.map(() => false),
  };
};

const resolveArrayMultiField = (
  files: AudioWithMetadata[],
  fields: MetadataFields,
  fieldName: "genre" | "composer" | "comment",
): MetadataField => {
  const field = fields[fieldName];

  return {
    multiValue:
      field.multiValue.length > 0
        ? field.multiValue
        : files.flatMap((file) =>
            (file.metadata?.[fieldName] || []).join(", "),
          ),
    isTouched:
      field.isTouched.length > 0 ? field.isTouched : files.map(() => false),
  };
};

const resolveMultiField = (
  files: AudioWithMetadata[],
  fields: MetadataFields,
  fieldName: "artist" | "title" | "album" | "year",
): MetadataField => {
  const field = fields[fieldName];

  return {
    multiValue:
      field.multiValue.length > 0
        ? field.multiValue
        : files.map((file) => file.metadata?.[fieldName]?.toString() ?? ""),
    isTouched:
      field.isTouched.length > 0 ? field.isTouched : files.map(() => false),
  };
};

const resolveFields = (
  files: AudioWithMetadata[],
  fields: MetadataFields,
): MetadataFields => ({
  artist: resolveMultiField(files, fields, "artist"),
  album: resolveMultiField(files, fields, "album"),
  title: resolveMultiField(files, fields, "title"),
  year: resolveMultiField(files, fields, "year"),
  track: resolveNumberOfMultiField(files, fields, "track", "no"),
  tracks: resolveNumberOfMultiField(files, fields, "track", "of"),
  disk: resolveNumberOfMultiField(files, fields, "disk", "no"),
  disks: resolveNumberOfMultiField(files, fields, "disk", "of"),
  genre: resolveArrayMultiField(files, fields, "genre"),
  composer: resolveArrayMultiField(files, fields, "composer"),
  comment: resolveArrayMultiField(files, fields, "comment"),
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
  const [fields, setFields] = useState<MetadataFields>(
    resolveFields(files, defaultFields),
  );
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const toUpdatePayload = (file: AudioWithMetadata, idx: number) => {
    const item: AudioWithMetadata = JSON.parse(
      JSON.stringify({
        ...file,
        metadata: {
          ...file.metadata,
        },
      }),
    );
    const tags: Partial<Tags> = {};
    const fid = urlSafeBase64.encode(
      item.fileUrl?.replace("media:/", "").replace("media:\\", "") ?? "",
    );

    if (fields.artist.isTouched[idx]) {
      const value = fields.artist.multiValue[idx] ?? "";
      tags.artist = value;
      item.metadata.artist = value;
    }
    if (fields.title.isTouched[idx]) {
      const value = fields.title.multiValue[idx] ?? "";
      tags.title = value;
      item.metadata.title = value;
    }
    if (fields.album.isTouched[idx]) {
      const value = fields.album.multiValue[idx] ?? "";
      tags.album = value;
      item.metadata.album = value;
    }
    if (fields.year.isTouched[idx]) {
      const value = fields.year.multiValue[idx] ?? "";
      tags.year = value;
      item.metadata.year = value;
    }
    if (fields.track.isTouched[idx]) {
      const noValue = fields.track.multiValue[idx] ?? "";
      tags.trackNumber = noValue;

      item.metadata.track = { no: noValue, of: "" };

      const diskNo = item.metadata.disk?.no
        ? Number(item.metadata.disk.no)
        : "";
      item.track = `${diskNo}.${noValue ? prefixNumber(Number(noValue)) : ""}`;
    }
    if (fields.tracks.isTouched[idx]) {
      tags.trackNumber = `${tags.trackNumber || ""}/${fields.tracks.multiValue[idx] ?? ""}`;

      const noValue = item.metadata.track?.no
        ? Number(item.metadata.track.no)
        : "";
      const ofValue = fields.tracks.multiValue[idx]
        ? Number(fields.tracks.multiValue[idx])
        : "";
      item.metadata.track = { no: noValue, of: ofValue };
    }
    if (fields.disk.isTouched[idx]) {
      const value = fields.disk.multiValue[idx] ?? "";
      tags.partOfSet = value;
      item.metadata.disk = { no: value, of: "" };
    }
    if (fields.disks.isTouched[idx]) {
      const diskNo = tags.partOfSet || file?.metadata?.disk?.no || "";
      const diskOf = fields.disks.multiValue[idx]
        ? `/${fields.disks.multiValue[idx]}`
        : "";

      tags.partOfSet = `${diskNo}${diskOf}`;
      item.metadata.disk = {
        no: item.metadata.disk?.no ? item.metadata.disk.no : "",
        of: fields.disks.multiValue[idx],
      };

      const noValue = item.metadata.track?.no
        ? Number(item.metadata.track.no)
        : "";
      const diskNo2 = item.metadata.disk?.no
        ? Number(item.metadata.disk.no)
        : "";
      item.track = `${diskNo2}.${noValue ? prefixNumber(Number(noValue)) : ""}`;
    }
    if (fields.genre.isTouched[idx]) {
      const value = fields.genre.multiValue[idx] ?? "";
      tags.genre = value;
      item.metadata.genre = value.split(",").map((it) => it.trim());
    }
    if (fields.composer.isTouched[idx]) {
      const value = fields.composer.multiValue[idx] ?? "";
      tags.composer = value;
      item.metadata.composer = value.split(",").map((it) => it.trim());
    }
    if (fields.comment.isTouched[idx]) {
      const value = fields.comment.multiValue[idx] ?? "";
      tags.comment = {
        language: "eng",
        text: value,
      };
      item.metadata.comment = value.split(",").map((it) => it.trim());
    }

    return { fid, tags, item };
  };

  const saveTags = async () => {
    const payloads: { fid: string; tags: Partial<Tags> }[] = [];
    const items: AudioWithMetadata[] = [];

    for (let i = 0; i < files.length; i++) {
      const { fid, tags, item } = toUpdatePayload(files[i], i);
      if (Object.keys(tags).length > 0) {
        payloads.push({ fid, tags });
        items.push(item);
      }
    }

    if (payloads.length < 1) {
      setError(t("modal.metadata.noChangesLabel"));
      return;
    }

    setIsLoading(true);
    setError("");
    let err;
    if (payloads.length > 1) {
      err = await Api.writeTagsMany(payloads);
    } else {
      const { fid, tags } = payloads[0];
      err = await Api.writeTags(fid, tags);
    }
    setIsLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    dispatch(updateManyById(items));
  };

  const toggleCombinedFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCombine(event.target.checked);
  };

  const updateValue = (valueArr: string[], key: keyof MetadataFields) => {
    // Have to do a deep copy here to sever the ref between the objects in the fields array
    const prevFields: MetadataFields = JSON.parse(JSON.stringify(fields));
    const newFields: MetadataFields = JSON.parse(JSON.stringify(fields));

    if (combine) {
      if (valueArr.length === 1) {
        // Reflect write-to-all to all files
        for (let i = 0; i < files.length; i++) {
          const value = valueArr[0];
          newFields[key].multiValue[i] = value;
          newFields[key].isTouched[i] = true;
        }
      } else {
        newFields[key].multiValue = valueArr;
        for (let i = 0; i < files.length; i++) {
          const value = valueArr[i];
          const isTouched =
            prevFields[key].isTouched[i] ||
            prevFields[key].multiValue[i] !== value;
          newFields[key].isTouched[i] = isTouched;
        }
      }
    } else {
      const value = valueArr[0];
      const isTouched =
        prevFields[key].isTouched[index] ||
        prevFields[key].multiValue[index] !== value;
      newFields[key].multiValue[index] = value;
      newFields[key].isTouched[index] = isTouched;
    }

    setFields(newFields);
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

        return (
          <div key={file.id}>
            {!showAllDetails ? (
              <Wrapper>
                {fieldKeys.map((key) => {
                  const field = { ...fields[key] };

                  return (
                    <React.Fragment key={key}>
                      <span>{t(`modal.metadata.tag.${key}`)}</span>
                      <EditorInput
                        field={field.multiValue}
                        index={index}
                        updateValue={(value) => updateValue(value, key)}
                        isMultiValue={combine}
                        isDisabled={isDisabled}
                      />
                    </React.Fragment>
                  );
                })}
                <span>{t("modal.metadata.tag.codec")}</span>
                <EditorInput
                  staticField={getCodecInfo(file).toLowerCase()}
                  isDisabled
                />
                <span>{t("modal.metadata.tag.comment")}</span>
                <EditorTextarea
                  field={fields.comment.multiValue}
                  index={index}
                  updateValue={(value) => updateValue(value, "comment")}
                  isMultiValue={combine}
                  isDisabled={isDisabled}
                />
              </Wrapper>
            ) : (
              <AllDetailsWrapper>
                <span>{t("modal.metadata.detail.fileUrl")}</span>
                <span
                  title={
                    file.fileUrl
                      ?.replace("media:/", "")
                      .replace("media:\\", "") ?? ""
                  }
                >
                  {file.fileUrl
                    ?.replace("media:/", "")
                    .replace("media:\\", "") ?? ""}
                </span>
                <span>{t("modal.metadata.detail.coverUrl")}</span>
                <span
                  title={
                    file.coverUrl
                      ?.replace("media:/", "")
                      .replace("media:\\", "") ?? ""
                  }
                >
                  {file.coverUrl
                    ?.replace("media:/", "")
                    .replace("media:\\", "") ?? ""}
                </span>
                <span>{t("modal.metadata.detail.duration")}</span>
                <span>{formatDuration(file.metadata.duration)}</span>
                <span>{t("modal.metadata.detail.sampleRate")}</span>
                <span>
                  {file.metadata.sampleRate
                    ? `${file.metadata.sampleRate} Hz`
                    : ""}
                </span>
                <span>{t("modal.metadata.detail.bitRate")}</span>
                <span>
                  {file.metadata.bitrate
                    ? `${file.metadata.bitrate / 1000} kbps`
                    : ""}
                </span>
                <span>{t("modal.metadata.detail.channels")}</span>
                <span>{file.metadata.numberOfChannels ?? ""}</span>
                <span title={t("modal.metadata.detail.codecDetails")}>
                  {t("modal.metadata.detail.codec")}
                </span>
                <span>{getCodecInfo(file)}</span>
                <span>{t("modal.metadata.detail.tagTypes")}</span>
                <span>
                  {(file.metadata.tagTypes || []).length
                    ? file.metadata.tagTypes?.join(", ")
                    : ""}
                </span>
                <span>{t("modal.metadata.detail.encoding")}</span>
                <span>
                  {file.metadata.lossless
                    ? t("modal.metadata.detail.encodingLossless")
                    : t("modal.metadata.detail.encodingLossy")}
                </span>
                <span>{t("modal.metadata.detail.encoder")}</span>
                <span>{file.metadata.tool ?? ""}</span>
                <span>{t("modal.metadata.detail.encoderSettings")}</span>
                <span title={file.metadata.encoderSettings ?? ""}>
                  {file.metadata.encoderSettings ?? ""}
                </span>
                <span title={t("modal.metadata.detail.drTrackDetails")}>
                  {t("modal.metadata.detail.drTrack")}
                </span>
                <span>
                  {file.metadata.dynamicRange
                    ? `${file.metadata.dynamicRange} dB`
                    : ""}
                </span>
                <span title={t("modal.metadata.detail.drAlbumDetails")}>
                  {t("modal.metadata.detail.drAlbum")}
                </span>
                <span>
                  {file.metadata.dynamicRangeAlbum
                    ? `${file.metadata.dynamicRangeAlbum} dB`
                    : ""}
                </span>
                <span
                  title={t("modal.metadata.detail.normalizationTrackDetails")}
                >
                  {t("modal.metadata.detail.normalizationTrack")}
                </span>
                <span>
                  {file.metadata.replayGainTrackGain?.dB
                    ? `${file.metadata.replayGainTrackGain?.dB} dB`
                    : ""}
                </span>
                <span
                  title={t("modal.metadata.detail.normalizationAlbumDetails")}
                >
                  {t("modal.metadata.detail.normalizationAlbum")}
                </span>
                <span>
                  {file.metadata.replayGainAlbumGain?.dB
                    ? `${file.metadata.replayGainAlbumGain?.dB} dB`
                    : ""}
                </span>
              </AllDetailsWrapper>
            )}
            <StyledActionsContainer>
              <div>
                <span>
                  {isLoading ? t("modal.saving") : ""} {error ? error : ""}
                </span>
              </div>
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
                  disabled={index < 1 || (combine && !showAllDetails)}
                >
                  {t("modal.metadata.previousButton")}
                </Button>
                <Button
                  isSmall
                  isSecondary
                  onClick={next}
                  disabled={
                    index >= files.length - 1 || (combine && !showAllDetails)
                  }
                >
                  {t("modal.metadata.nextButton")}
                </Button>
                <SaveButton isPrimary onClick={saveTags} disabled={isLoading}>
                  {`${t("modal.saveButton")}${files.length > 1 && combine ? ` (${files.length})` : ""}`}
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
