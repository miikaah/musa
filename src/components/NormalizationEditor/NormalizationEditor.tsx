import { AudioWithMetadata, NormalizationResults } from "@miikaah/musa-core";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "../Button";
import * as Api from "../../apiClient";
import AlbumImage from "../AlbumImage";
import { TranslateFn } from "../../i18n";
import { connect } from "react-redux";
import { SettingsState } from "../../reducers/settings.reducer";

const Container = styled.div`
  width: 100%;
  background: white;
  color: black;
  font-size: var(--font-size-xs);
  overflow: scroll;
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

    > div {
      display: grid;
      grid-template-columns: 40fr 60fr;

      > span:last-of-type {
        text-align: right;
        font-family: Courier, "Lucida Console", Monaco, Consolas, monospace;
      }
    }
  }
`;

const sharedCss = css`
  display: grid;
  grid-template-columns: 4fr 10fr 8fr 20fr 58fr;
  text-align: center;

  > div {
    width: 100%;
  }

  > div:first-of-type {
    margin-left: 4px;
  }

  > div:nth-of-type(2),
  > div:nth-of-type(3) {
    text-align: right;
  }

  > div:nth-of-type(2) {
    padding-right: 4px;
  }

  > div:nth-of-type(3) {
    padding-right: 14px;
  }

  > div:nth-of-type(5) {
    text-align: left;
  }
`;

const Header = styled.div`
  ${sharedCss}
  font-weight: 800;
  margin-bottom: 4px;

  > div:nth-of-type(4) {
    text-align: center;
  }
`;

const Row = styled.div`
  ${sharedCss}

  > div {
    font-family: Courier, "Lucida Console", Monaco, Consolas, monospace;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: right;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.666);
  width: 100%;

  > button {
    max-width: 140px;
    margin: 10px 20px 10px;
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

const DataWrapper = styled.div`
  padding-bottom: 40px;
`;

const resolveAlbums = (files: AudioWithMetadata[]) => {
  const albums: Record<
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
  > = {};

  for (const file of files) {
    const id =
      `${file.metadata.artist ?? ""}${file.metadata.album ?? ""}`.replaceAll(
        " ",
        "",
      );
    const entry = albums[id] ?? {};
    const items = entry.files ?? [];
    albums[id] = {
      artist: file.metadata.artist ?? albums[id].artist ?? "",
      album: file.metadata.album ?? albums[id].album ?? "",
      year: `${file.metadata.year ?? albums[id].year ?? ""}`,
      coverUrl: file.coverUrl ?? albums[id].coverUrl ?? "",
      albumGainDb:
        file.metadata.replayGainAlbumGain?.dB ?? albums[id].albumGainDb ?? "",
      albumDynamicRangeDb:
        file.metadata.dynamicRangeAlbum ?? albums[id].albumDynamicRangeDb ?? "",
      files: [...items, file],
    };
  }

  return Object.entries(albums);
};

const isFilesystemFiles = (
  files: NormalizationResults[string]["files"] | AudioWithMetadata[],
): files is AudioWithMetadata[] => "metadata" in files[0];

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
  const [nAlbums, setNAlbums] = useState<NormalizationResults>({});

  const albums = resolveAlbums(files);

  const normalize = async () => {
    const albumsToNormalize = albums.map(([id, { files }]) => ({
      album: id,
      files: files
        .map((file) => file.fileUrl)
        .filter((url) => typeof url === "string"),
    }));
    console.log("normalizeMany", albumsToNormalize);
    const normalizedAlbums = await Api.normalizeMany(albumsToNormalize);
    console.log(normalizedAlbums);
    setNAlbums(normalizedAlbums);
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
                    {(albumGainDb !== "" || nAlbums[id]) && (
                      <div>
                        <span>{t("modal.normalization.gain")}</span>
                        <span>
                          {nAlbums[id]?.albumGainDb ?? albumGainDb} dB
                        </span>
                      </div>
                    )}
                    {(albumDynamicRangeDb !== "" || nAlbums[id]) && (
                      <div>
                        <span>{t("modal.normalization.dynamicRange")}</span>
                        <span>
                          {nAlbums[id]?.albumDynamicRangeDb ??
                            albumDynamicRangeDb}{" "}
                          dB
                        </span>
                      </div>
                    )}
                  </div>
                </AlbumWrapper>
              </AlbumContainer>
              <DataWrapper>
                <Header>
                  <div>#</div>
                  <div>{t("modal.normalization.gain")}</div>
                  <div>{t("modal.normalization.dynamicRange")}</div>
                  <div>{t("modal.normalization.peak")}</div>
                  <div>{t("modal.normalization.name")}</div>
                </Header>
                {resolveFiles(files, nAlbums[id]?.files).map((file, i) => (
                  <Row key={`${file.filepath}-${i}`}>
                    <div>{file.track ?? ""}</div>
                    <div>{file.gainDb ?? ""} dB</div>
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
      <ActionsContainer>
        <Button isPrimary onClick={normalize}>
          {t("modal.normalization.normalizeButton")}
        </Button>
      </ActionsContainer>
    </>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(NormalizationEditor);
