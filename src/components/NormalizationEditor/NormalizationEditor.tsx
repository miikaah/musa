import {
  AudioWithMetadata,
  NormalizationResult,
  NormalizationResults,
  Tags,
} from "@miikaah/musa-core";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "../Button";
import * as Api from "../../apiClient";
import AlbumImage from "../AlbumImage";
import { TranslateFn } from "../../i18n";
import { connect, useDispatch } from "react-redux";
import { SettingsState } from "../../reducers/settings.reducer";
import { cleanUrl, urlSafeBase64 } from "../../util";
import { useMemoizedApiCall } from "../../hooks/useMemoizedApiCall";
import { ActionsContainer } from "../Modal/ActionsContainer";
import { updateManyById } from "../../reducers/player.reducer";

const Container = styled.div`
  width: 100%;
  background: white;
  color: black;
  font-size: var(--font-size-xs);
  overflow: auto;
  max-height: 100%;
  position: relative;
  padding-bottom: 80px;
`;

const AlbumContainer = styled.div`
  display: flex;
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > div:nth-of-type(2) {
    margin: 10px 0 18px;

    > table {
      font-family: Courier, "Lucida Console", Monaco, Consolas, monospace;

      > tbody {
        > tr {
          > td:last-of-type {
            padding-left: 8px;
            text-align: right;
          }
        }
      }
    }
  }
`;

const DataWrapper = styled.div`
  padding-bottom: 26px;
  margin-left: 20px;
`;

const sharedCss = css`
  display: grid;
  grid-template-columns: 4fr 10fr 8fr 20fr 58fr;
  text-align: center;

  > div {
    width: 100%;
  }

  > div:nth-of-type(2),
  > div:nth-of-type(3) {
    text-align: right;
  }

  > div:nth-of-type(2) {
    padding-right: 4px;
  }

  > div:nth-of-type(5) {
    text-align: left;
  }
`;

const Header = styled.div`
  ${sharedCss}
  font-weight: 800;
  margin-bottom: 4px;

  > div:nth-of-type(3) {
    padding-right: 20px;
  }

  > div:nth-of-type(4) {
    text-align: center;
  }
`;

const Row = styled.div`
  ${sharedCss}

  > div {
    font-family: Courier, "Lucida Console", Monaco, Consolas, monospace;
  }

  > div:nth-of-type(3) {
    padding-right: 10px;
  }
`;

const CoverWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
  min-height: 120px;
  margin: 0 20px 20px;

  > img {
    width: 120px;
    height: 120px;
    object-fit: scale-down;
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
  margin: 0 0 10px 0 !important;
`;

type AlbumsById = Record<
  string,
  {
    artist: string;
    album: string;
    year: string;
    coverUrl: string;
    albumGainDb: string | number;
    albumDynamicRangeDb: string | number;
    files: AudioWithMetadata[];
  }
>;

const resolveAlbums = (files: AudioWithMetadata[]) => {
  const albums: AlbumsById = {};

  for (const file of files) {
    const id =
      `${file.metadata.artist ?? ""}${file.metadata.album ?? ""}`.replaceAll(
        " ",
        "",
      );
    const entry = albums[id] ?? {};
    const items = entry.files ?? [];
    albums[id] = {
      artist: file.metadata.artist ?? entry.artist ?? "",
      album: file.metadata.album ?? entry.album ?? "",
      year: `${file.metadata.year ?? entry.year ?? ""}`,
      coverUrl: file.coverUrl ?? entry.coverUrl ?? "",
      albumGainDb:
        file.metadata.replayGainAlbumGain?.dB ?? entry.albumGainDb ?? "",
      albumDynamicRangeDb:
        file.metadata.dynamicRangeAlbum ?? entry.albumDynamicRangeDb ?? "",
      files: [...items, file],
    };
  }

  return Object.entries(albums);
};

const resolveFiles = (
  files: AudioWithMetadata[],
  nAlbumFiles?: NormalizationResults[string]["files"],
) => {
  return files.map((file) => {
    const aFile = nAlbumFiles?.find((f) => f.filepath === file.fileUrl);
    return {
      name: file.name,
      track: file.track,
      filepath: file.fileUrl ?? "",
      targetLevelDb: aFile?.targetLevelDb ?? -18,
      gainDb: aFile?.gainDb ?? file.metadata.replayGainTrackGain?.dB,
      samplePeak:
        aFile?.samplePeak ??
        Number(file.metadata.replayGainTrackPeak?.ratio ?? 0),
      samplePeakDb:
        aFile?.samplePeakDb ??
        Number(file.metadata.replayGainTrackPeak?.dB ?? 0),
      dynamicRangeDb:
        aFile?.dynamicRangeDb ?? Number(file.metadata.dynamicRange ?? 0),
    };
  });
};

type NormalizationEditorProps = {
  files: AudioWithMetadata[];
  t: TranslateFn;
};

const NormalizationEditor = ({ files, t }: NormalizationEditorProps) => {
  const [error, setError] = useState("");
  const [isSavingTags, setIsSavingTags] = useState(false);
  const albums = resolveAlbums(files);
  const albumsToNormalize = albums.map(([id, { files }]) => ({
    album: id,
    files: files
      .map((file) => cleanUrl(file.fileUrl))
      .filter((url) => typeof url === "string"),
  }));
  const hash = albumsToNormalize.map((a) => a.album).join("");
  const dispatch = useDispatch();
  // TODO: Handle individual errors in files

  const {
    currentData: nAlbums,
    isLoading: fetchIsLoading,
    error: fetchError,
    fetchData,
  } = useMemoizedApiCall<NormalizationResults>(hash, async () =>
    Api.normalizeMany(albumsToNormalize),
  );
  const isLoading = fetchIsLoading || isSavingTags;

  const toUpdatePayload = (result: NormalizationResult) => {
    return result.files.map((r) => {
      const tags: Partial<Tags> = {
        userDefinedText: [
          {
            description: "ALBUM DYNAMIC RANGE",
            value: String(result.albumDynamicRangeDb),
          },
          {
            description: "DYNAMIC RANGE",
            value: String(r.dynamicRangeDb),
          },
          {
            description: "replaygain_album_gain",
            value: `${String(result.albumGainDb)} dB`,
          },
          {
            description: "replaygain_album_peak",
            value: String(result.albumSamplePeak),
          },
          {
            description: "replaygain_track_gain",
            value: `${String(r.gainDb)} dB`,
          },
          {
            description: "replaygain_track_peak",
            value: String(r.samplePeak),
          },
        ],
      };
      const file = files.find((f) => f.fileUrl === r.filepath);
      const fid = urlSafeBase64.encode(
        file?.fileUrl?.replace("media:/", "").replace("media:\\", "") ?? "",
      );
      const item: AudioWithMetadata = JSON.parse(
        JSON.stringify({
          ...file,
          metadata: {
            ...file?.metadata,
          },
        }),
      );

      if (item.metadata.replayGainAlbumGain === undefined) {
        item.metadata.replayGainAlbumGain = { dB: 0, ratio: 0 };
      }
      if (result.albumGainDb !== undefined) {
        const dB = result.albumGainDb;
        item.metadata.replayGainAlbumGain.dB = dB;
        item.metadata.replayGainAlbumGain.ratio = Math.pow(10, dB / 10);
      }

      if (item.metadata.replayGainAlbumPeak === undefined) {
        item.metadata.replayGainAlbumPeak = { dB: 0, ratio: 0 };
      }
      if (result.albumSamplePeak !== undefined) {
        const ratio = result.albumSamplePeak;
        item.metadata.replayGainAlbumPeak.dB = 10 * Math.log10(ratio);
        item.metadata.replayGainAlbumPeak.ratio = ratio;
      }

      if (item.metadata.replayGainTrackGain === undefined) {
        item.metadata.replayGainTrackGain = { dB: 0, ratio: 0 };
      }
      if (r.gainDb !== undefined) {
        const dB = r.gainDb;
        item.metadata.replayGainTrackGain.dB = dB;
        item.metadata.replayGainTrackGain.ratio = Math.pow(10, dB / 10);
      }

      if (item.metadata.replayGainTrackPeak === undefined) {
        item.metadata.replayGainTrackPeak = { dB: 0, ratio: 0 };
      }
      if (r.samplePeak !== undefined) {
        const ratio = r.samplePeak;
        item.metadata.replayGainTrackPeak.dB = 10 * Math.log10(ratio);
        item.metadata.replayGainTrackPeak.ratio = ratio;
      }

      if (result.albumDynamicRangeDb !== undefined) {
        item.metadata.dynamicRangeAlbum = String(result.albumDynamicRangeDb);
      }
      if (r.dynamicRangeDb !== undefined) {
        item.metadata.dynamicRange = String(r.dynamicRangeDb);
      }

      return { fid, tags, item };
    });
  };

  const saveTags = async () => {
    const payloads: { fid: string; tags: Partial<Tags> }[] = [];
    const items: AudioWithMetadata[] = [];

    for (const result of Object.values(nAlbums)) {
      const mapped = toUpdatePayload(result);
      mapped.forEach(({ fid, tags, item }) => {
        payloads.push({ fid, tags });
        items.push(item);
      });
    }

    setIsSavingTags(true);
    setError("");
    let err;
    if (payloads.length > 1) {
      err = await Api.writeTagsMany(payloads);
    } else {
      const { fid, tags } = payloads[0];
      err = await Api.writeTags(fid, tags);
    }
    setIsSavingTags(false);
    if (err) {
      setError(err.message);
      return;
    }

    dispatch(updateManyById(items));
  };

  return (
    <>
      <Container>
        {albums.map(
          ([
            id,
            {
              artist,
              album,
              year,
              coverUrl,
              albumGainDb,
              albumDynamicRangeDb,
              files,
            },
          ]) => (
            <div key={id}>
              <AlbumContainer>
                <CoverWrapper>
                  <AlbumImage
                    item={{ coverUrl } as AudioWithMetadata}
                    animate={false}
                  />
                </CoverWrapper>
                <AlbumWrapper>
                  <div>
                    <div>{artist}</div>
                    <div>{album}</div>
                    <div>{year}</div>
                  </div>
                  <div>
                    <table>
                      <tbody>
                        {(albumGainDb !== "" || nAlbums?.[id]) && (
                          <tr>
                            <td>{t("modal.normalization.gain")}</td>
                            <td>
                              {nAlbums?.[id]?.albumGainDb ?? albumGainDb} dB
                            </td>
                          </tr>
                        )}
                        {(albumDynamicRangeDb !== "" || nAlbums?.[id]) && (
                          <tr>
                            <td>{t("modal.normalization.dynamicRange")}</td>
                            <td>
                              {nAlbums?.[id]?.albumDynamicRangeDb ??
                                albumDynamicRangeDb}{" "}
                              dB
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AlbumWrapper>
              </AlbumContainer>
              <DataWrapper>
                <Header>
                  <div>#</div>
                  <div>{t("modal.normalization.gain")}</div>
                  <div>{t("modal.normalization.dr")}</div>
                  <div>{t("modal.normalization.peak")}</div>
                  <div>{t("modal.normalization.name")}</div>
                </Header>
                {resolveFiles(files, nAlbums?.[id]?.files).map((file, i) => (
                  <Row key={`${file.filepath}-${i}`}>
                    <div>{file.track ?? ""}</div>
                    <div>{Number(file.gainDb ?? 0).toFixed(2)} dB</div>
                    <div>{file.dynamicRangeDb ?? ""} dB</div>
                    <div>
                      <span>{Number(file.samplePeak ?? 0).toFixed(5)}</span>
                      <span>{` (${
                        file.samplePeakDb.toString().startsWith("-") ? "" : "+"
                      }${file.samplePeakDb.toFixed(2)} dB)`}</span>
                    </div>
                    <div>{file.name}</div>
                  </Row>
                ))}
              </DataWrapper>
            </div>
          ),
        )}
      </Container>
      <StyledActionsContainer>
        <div>
          <span>
            {isLoading ? t("modal.normalization.calculating") : ""}{" "}
            {error ? error : fetchError ? fetchError : ""}
          </span>
        </div>
        <div>
          <Button isSecondary onClick={fetchData} disabled={isLoading}>
            {t("modal.normalization.normalizeButton")}
          </Button>
          <SaveButton
            isPrimary
            onClick={saveTags}
            disabled={isLoading || !nAlbums}
          >
            {`${t("modal.metadata.saveButton")}${files.length > 1 ? ` (${files.length})` : ""}`}
          </SaveButton>
        </div>
      </StyledActionsContainer>
    </>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(NormalizationEditor);
