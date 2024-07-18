import { AudioWithMetadata, NormalizationResults } from "@miikaah/musa-core";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "../Button";
import * as Api from "../../apiClient";
import AlbumImage from "../AlbumImage";

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

  > div:nth-of-type(4) {
    margin-top: 10px;
  }

  > div:nth-of-type(4) {
    font-size: var(--font-size-xxs);

    > div {
      display: grid;
      grid-template-columns: 45fr 55fr;

      > span:last-of-type {
        text-align: right;
      }
    }
  }
`;

const sharedCss = css`
  display: grid;
  grid-template-columns: 4fr 10fr 8fr 16fr 62fr;
  font-size: var(--font-size-xxs);
  text-align: center;

  > div {
    width: 100%;
    padding: 0 4px 4px;
  }

  > div:first-of-type {
    margin-left: 4px;
  }

  > div:nth-of-type(5),
  > div:nth-of-type(6),
  > div:nth-of-type(7) {
    text-align: left;
  }
`;

const Header = styled.div`
  ${sharedCss}
  font-weight: 800;
`;

const Row = styled.div`
  ${sharedCss}
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 30px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: white;
  width: 100%;

  > button {
    max-width: 140px;
    margin: 10px;
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
  padding-bottom: 30px;
`;

const resolveAlbums = (files: AudioWithMetadata[]) => {
  const albums: Record<
    string,
    {
      artist: string;
      album: string;
      year: string;
      coverUrl: string;
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
      artist: file.metadata.artist ?? "",
      album: file.metadata.album ?? "",
      year: `${file.metadata.year ?? ""}`,
      coverUrl: file.coverUrl ?? "",
      files: [...items, file],
    };
  }

  return Object.entries(albums);
};

type NormalizationEditorProps = {
  files: AudioWithMetadata[];
};

export const NormalizationEditor = ({ files }: NormalizationEditorProps) => {
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
        {albums.map(([id, { artist, album, year, coverUrl, files }]) => (
          <div key={id}>
            <AlbumContainer>
              <CoverWrapper>
                <AlbumImage
                  item={{ coverUrl } as AudioWithMetadata}
                  animate={false}
                />
              </CoverWrapper>
              <AlbumWrapper>
                <div>{artist}</div>
                <div>{album}</div>
                <div>{year}</div>
                <div>
                  {nAlbums[id] && (
                    <div>
                      <span>Gain:</span>
                      <span>{nAlbums[id]?.albumGainDb} dB</span>
                    </div>
                  )}
                  {nAlbums[id] && (
                    <div>
                      <span>DR:</span>
                      <span>{nAlbums[id]?.albumDynamicRangeDb} dB</span>
                    </div>
                  )}
                </div>
              </AlbumWrapper>
            </AlbumContainer>
            <DataWrapper>
              <Header>
                <div>#</div>
                <div>Gain</div>
                <div>DR</div>
                <div>Peak</div>
                <div>Name</div>
              </Header>
              {files.map((file, i) => (
                <Row key={`${file.id}-${i}`}>
                  <div>{file.metadata.track?.no ?? ""}</div>
                  <div>{file.metadata.replayGainTrackGain?.dB ?? ""} dB</div>
                  <div>{file.metadata.dynamicRange ?? ""} dB</div>
                  <div>
                    <span>
                      {Number(
                        file.metadata.replayGainTrackPeak?.ratio ?? 0,
                      ).toFixed(5)}
                    </span>
                    <span>{` (${Number(file.metadata.replayGainTrackPeak?.dB ?? 0).toFixed(2)} dB)`}</span>
                  </div>
                  <div>{file.name}</div>
                </Row>
              ))}
            </DataWrapper>
          </div>
        ))}
      </Container>
      <ActionsContainer>
        <Button isPrimary onClick={normalize}>
          Normalize
        </Button>
      </ActionsContainer>
    </>
  );
};
