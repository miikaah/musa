import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { ellipsisTextOverflow } from "../common.styles";

const Container = styled.div`
  padding: ${({ isSmall }) =>
    isSmall ? "20px 20px 20px 10px" : "20px 20px 20px 10px"};
  min-width: ${({ isSmall }) => (isSmall ? 394 : 432)}px;
  position: relative;

  > button:nth-child(1) {
    visibility: hidden;
  }

  > div:nth-child(2) {
    padding-bottom: 8px;
  }

  > div:nth-child(3) {
    font-weight: bold;
    padding-bottom: 8px;
    font-size: 30px;
  }

  > div:nth-child(4) {
    font-size: var(--font-size-xs);

    > span:nth-child(2) {
      margin: 0 4px;
    }
  }

  &:hover {
    > button:nth-child(1) {
      visibility: visible;
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    > div:nth-child(2) {
      padding-bottom: 0;
    }

    > div:nth-child(3) {
      padding-bottom: 0;
    }
  }
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  font-size: 12px;
  max-height: 200px;
`;

const Metadata = styled.div`
  margin-top: 4px;

  > div {
    display: flex;

    > span {
      ${ellipsisTextOverflow}
    }
    > span:first-of-type {
      padding-right: 20px;
      flex: 0 1 50%;
    }
    > span:last-of-type {
      flex: 0 0 50%;
    }
  }
`;

const ToggleEditButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

const getBitrate = (bitrate) => {
  return isFinite(bitrate) ? `${Math.floor(bitrate / 1000)} kbps` : "";
};

const getSampleRate = (sampleRate) => {
  return sampleRate ? `${sampleRate} Hz` : "";
};

const CoverInfo = ({ item, isSmall, toggleEdit, t }) => {
  if (Object.keys(item) < 1) {
    return null;
  }

  const artist = item?.metadata?.artist || item?.artistName || "";
  const album = item?.metadata?.album || item?.albumName || "";
  const title = item?.metadata?.title || item?.name || "";
  const year = item?.metadata?.year || "";

  const genre = Array.isArray(item?.metadata?.genre)
    ? item?.metadata?.genre.join(", ")
    : "";
  const bitrate = getBitrate(item?.metadata?.bitrate);
  const sampleRate = getSampleRate(item?.metadata?.sampleRate);

  return (
    <Container isSmall={isSmall}>
      <ToggleEditButton onClick={toggleEdit}>
        <FontAwesomeIcon icon="pencil" />
      </ToggleEditButton>
      <div>{title}</div>
      <div>{album}</div>
      <div>
        <span>{artist}</span>
        {item && item?.metadata && <span>{year ? "\u00B7" : ""}</span>}
        <span>{year}</span>
      </div>
      <MetadataContainer>
        <Metadata>
          <div>
            <span>{t("coverInfo.metadata.genre")}</span>
            <span title={genre}>{genre}</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.normalization.track")}</span>
            <span>{item?.metadata?.replayGainTrackGain?.dB} dB</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.normalization.album")}</span>
            <span>{item?.metadata?.replayGainAlbumGain?.dB} dB</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.dr.track")}</span>
            <span>{item?.metadata?.dynamicRange} dB</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.dr.album")}</span>
            <span>{item?.metadata?.dynamicRangeAlbum} dB</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.bitrate")}</span>
            <span>{bitrate}</span>
          </div>
          <div>
            <span>{t("coverInfo.metadata.sampleRate")}</span>
            <span>{sampleRate}</span>
          </div>
        </Metadata>
      </MetadataContainer>
    </Container>
  );
};

export default connect(
  (state) => ({
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(CoverInfo);
