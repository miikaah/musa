import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";

const Container = styled.div`
  padding: ${({ isSmall }) =>
    isSmall ? "20px 20px 20px 10px" : "20px 20px 20px 10px"};

  > div:nth-child(1) {
    padding-bottom: 8px;
  }

  > div:nth-child(2) {
    font-weight: bold;
    padding-bottom: 8px;
    font-size: 30px;
  }

  > div:nth-child(3) {
    font-size: var(--font-size-xs);

    > span:nth-child(2) {
      margin: 0 4px;
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
      padding-right: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > span:first-of-type {
      flex: 0 1 50%;
    }
    > span:last-of-type {
      flex: 0 0 50%;
    }
  }
`;

const getBitrate = (bitrate) => {
  return isFinite(bitrate) ? `${Math.floor(bitrate / 1000)} kbps` : "";
};

const getSampleRate = (sampleRate) => {
  return sampleRate ? `${sampleRate} Hz` : "";
};

const CoverInfo = ({ item, isSmall, showMetadata, dispatch }) => {
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
      <div>{title}</div>
      <div>{album}</div>
      <div>
        <span>{artist}</span>
        {item && item?.metadata && <span>{year ? "\u00B7" : ""}</span>}
        <span>{year}</span>
      </div>
      <MetadataContainer>
        {showMetadata && (
          <Metadata>
            <div>
              <span>Genre</span>
              <span title={genre}>{genre}</span>
            </div>
            <div>
              <span>Replaygain track</span>
              <span>{item?.metadata?.replayGainTrackGain?.dB}</span>
            </div>
            <div>
              <span>Replaygain album</span>
              <span>{item?.metadata?.replayGainAlbumGain?.dB}</span>
            </div>
            <div>
              <span>Dynamic range track</span>
              <span>{item?.metadata?.dynamicRange}</span>
            </div>
            <div>
              <span>Dynamic range album</span>
              <span>{item?.metadata?.dynamicRangeAlbum}</span>
            </div>
            <div>
              <span>Bitrate</span>
              <span>{bitrate}</span>
            </div>
            <div>
              <span>Sample rate</span>
              <span>{sampleRate}</span>
            </div>
          </Metadata>
        )}
      </MetadataContainer>
    </Container>
  );
};

export default connect(
  (state) => ({
    showMetadata: state.settings.showMetadata,
  }),
  (dispatch) => ({ dispatch })
)(CoverInfo);
