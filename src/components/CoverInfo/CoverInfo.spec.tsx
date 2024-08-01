import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoverInfo from "./CoverInfo";
import { audioFixture } from "../../fixtures/audio.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockToggleEdit = vi.fn();

const title = String(audioFixture.metadata.title);
const album = String(audioFixture.metadata.album);
const artist = String(audioFixture.metadata.artist);
const year = String(audioFixture.metadata.year);

const t = translate("en");
const genreText = String(t("coverInfo.metadata.genre"));
const genre = String(audioFixture.metadata.genre);
const trackGainText = String(t("coverInfo.metadata.normalization.track"));
const trackGain = String(audioFixture.metadata.replayGainTrackGain?.dB + " dB");
const albumGainText = String(t("coverInfo.metadata.normalization.album"));
const albumGain = String(audioFixture.metadata.replayGainAlbumGain?.dB + " dB");
const drTrackText = String(t("coverInfo.metadata.dr.track"));
const drTrack = String(audioFixture.metadata.dynamicRange + " dB");
const drAlbumText = String(t("coverInfo.metadata.dr.album"));
const drAlbum = String(audioFixture.metadata.dynamicRangeAlbum + " dB");
const bitrateText = String(t("coverInfo.metadata.bitRate"));
const bitrate = String(`${Number(audioFixture.metadata.bitrate) / 1000} kbps`);
const sampleRateText = String(t("coverInfo.metadata.sampleRate"));
const sampleRate = String(`${audioFixture.metadata.sampleRate} Hz`);

const state = {
  settings: { t },
};

describe("CoverInfo", () => {
  it("renders CoverInfo component", async () => {
    render(
      <CoverInfo
        item={audioFixture}
        isSmall={false}
        toggleEdit={mockToggleEdit}
      />,
      state,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(album)).toBeInTheDocument();
    expect(screen.getByText(artist)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();

    expect(screen.getByText(genreText)).toBeInTheDocument();
    expect(screen.getByText(genre)).toBeInTheDocument();

    expect(screen.getByText(trackGainText)).toBeInTheDocument();
    expect(screen.getByText(trackGain)).toBeInTheDocument();

    expect(screen.getByText(albumGainText)).toBeInTheDocument();
    expect(screen.getByText(albumGain)).toBeInTheDocument();

    expect(screen.getByText(drTrackText)).toBeInTheDocument();
    expect(screen.getByText(drTrack)).toBeInTheDocument();

    expect(screen.getByText(drAlbumText)).toBeInTheDocument();
    expect(screen.getByText(drAlbum)).toBeInTheDocument();

    expect(screen.getByText(bitrateText)).toBeInTheDocument();
    expect(screen.getByText(bitrate)).toBeInTheDocument();

    expect(screen.getByText(sampleRateText)).toBeInTheDocument();
    expect(screen.getByText(sampleRate)).toBeInTheDocument();
  });

  it("renders null when empty item", async () => {
    render(
      <CoverInfo
        item={undefined}
        isSmall={false}
        toggleEdit={mockToggleEdit}
      />,
      state,
    );

    expect(screen.queryByText(album)).not.toBeInTheDocument();
    expect(screen.queryByText(artist)).not.toBeInTheDocument();
    expect(screen.queryByText(year)).not.toBeInTheDocument();
  });

  it("calls toggleEdit click handler", async () => {
    render(
      <CoverInfo
        item={audioFixture}
        isSmall={false}
        toggleEdit={mockToggleEdit}
      />,
      state,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(mockToggleEdit).toHaveBeenCalledOnce();
  });
});
