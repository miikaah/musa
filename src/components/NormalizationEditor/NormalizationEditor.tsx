import { AudioWithMetadata } from "@miikaah/musa-core";
import React from "react";
import styled, { css } from "styled-components";
import Button from "../Button";
import * as Api from "../../apiClient";

const Container = styled.div`
  width: 100%;
  background: white;
  color: black;
  font-size: var(--font-size-xs);
  overflow: scroll;
  max-height: 100%;
`;

const sharedCss = css`
  display: grid;
  grid-template-columns: 4fr 10fr 10fr 14fr 28fr 16fr 10fr 8fr;
  font-size: var(--font-size-xxs);
  text-align: center;

  > div {
    width: 100%;
    padding: 0 4px 8px;
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
  justify-content: center;
  margin-top: 30px;

  > button {
    max-width: 200px;
  }
`;

type NormalizationEditorProps = {
  files: AudioWithMetadata[];
};

export const NormalizationEditor = ({ files }: NormalizationEditorProps) => {
  const normalize = async () => {
    console.log("normalizeMany");
    console.log(
      await Api.normalizeMany([
        {
          album: "",
          files: files
            .map((file) => file.fileUrl)
            .filter((url) => typeof url === "string"),
        },
      ]),
    );
  };

  return (
    <Container>
      <Header>
        <div>#</div>
        <div>Track gain</div>
        <div>Album gain</div>
        <div>Track peak</div>
        <div>Name</div>
        <div>Album</div>
        <div>Artist</div>
        <div>Year</div>
      </Header>
      {files.map((file, i) => (
        <Row key={`${file.id}-${i}`}>
          <div>{file.metadata.track?.no ?? ""}</div>
          <div>{file.metadata.replayGainTrackGain?.dB ?? ""} dB</div>
          <div>{file.metadata.replayGainAlbumGain?.dB ?? ""} dB</div>
          <div>
            <span>
              {Number(file.metadata.replayGainTrackPeak?.ratio ?? 0).toFixed(5)}
            </span>
            <span>{` (${Number(file.metadata.replayGainTrackPeak?.dB ?? 0).toFixed(2)} dB)`}</span>
          </div>
          <div>{file.name}</div>
          <div>{file.metadata.album}</div>
          <div>{file.metadata.artist}</div>
          <div>{file.metadata.year}</div>
        </Row>
      ))}
      <ActionsContainer>
        <Button isPrimary onClick={normalize}>
          Normalize
        </Button>
      </ActionsContainer>
    </Container>
  );
};
