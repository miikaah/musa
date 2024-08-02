import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MetadataEditor from "./MetadataEditor";
import { audioFixture } from "../../fixtures/audio.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import * as Api from "../../apiClient";
import { getCodecInfo } from "./getCodecInfo";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../apiClient");
vi.mocked(Api.writeTagsMany).mockResolvedValue(undefined);

const t = translate("en");
const artistText = String(t("modal.metadata.tag.artist"));
const artist = String(audioFixture.metadata?.artist);
const titleText = String(t("modal.metadata.tag.title"));
const title = String(audioFixture.metadata?.title);
const albumText = String(t("modal.metadata.tag.album"));
const album = String(audioFixture.metadata?.album);
const yearText = String(t("modal.metadata.tag.year"));
const year = String(audioFixture.metadata?.year);
const trackText = String(t("modal.metadata.tag.track"));
const track = String(audioFixture.metadata?.track?.no);
const tracksText = String(t("modal.metadata.tag.tracks"));
const tracks = String(audioFixture.metadata?.track?.of);
const diskText = String(t("modal.metadata.tag.disk"));
const disk = String(audioFixture.metadata?.disk?.no);
const disksText = String(t("modal.metadata.tag.disks"));
const disks = String(audioFixture.metadata?.disk?.of);
const genreText = String(t("modal.metadata.tag.genre"));
const genre = String(audioFixture.metadata?.genre);
const composerText = String(t("modal.metadata.tag.composer"));
const composer = String(audioFixture.metadata?.composer);
const codecText = String(t("modal.metadata.tag.codec"));
const codec = getCodecInfo(audioFixture);
const commentText = String(t("modal.metadata.tag.comment"));
const comment = String(audioFixture.metadata?.comment);
const saveButtonText = String(t("modal.metadata.saveButton"));

const state = {
  settings: { t },
};

describe("MetadataEditor", () => {
  it("renders MetadataEditor component", async () => {
    render(<MetadataEditor activeIndex={0} files={[audioFixture]} />, state);

    expect(screen.getByText(artistText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(artist)).toBeInTheDocument();

    expect(screen.getByText(titleText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(title)).toBeInTheDocument();

    expect(screen.getByText(albumText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(album)).toBeInTheDocument();

    expect(screen.getByText(yearText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(year)).toBeInTheDocument();

    expect(screen.getAllByDisplayValue(track).length).toBe(3);

    expect(screen.getByText(trackText)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(track)[0]).toBeInTheDocument();

    expect(screen.getByText(tracksText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(tracks)).toBeInTheDocument();

    expect(screen.getByText(diskText)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(disk)[1]).toBeInTheDocument();

    expect(screen.getByText(disksText)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(disks)[2]).toBeInTheDocument();

    expect(screen.getByText(genreText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(genre)).toBeInTheDocument();

    expect(screen.getByText(composerText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(composer)).toBeInTheDocument();

    expect(screen.getByText(codecText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(codec.toLowerCase())).toBeInTheDocument();

    expect(screen.getByText(commentText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(comment)).toBeInTheDocument();

    expect(screen.getByText(saveButtonText)).toBeInTheDocument();
  });

  it("calls api with updated tags", async () => {
    render(<MetadataEditor activeIndex={0} files={[audioFixture]} />, state);

    const editedArtist = `${artist} edit`;
    const artistElement = screen.getByDisplayValue(artist);

    await userEvent.type(artistElement, " edit");
    await userEvent.click(screen.getByText(saveButtonText));

    expect(artistElement).toHaveValue(editedArtist);
    expect(Api.writeTagsMany).toHaveBeenCalledWith([
      {
        fid: expect.any(String),
        tags: {
          artist: editedArtist,
        },
      },
    ]);
    expect(
      mockDispatch.mock.calls[0][0].items[0].metadata.artist,
    ).toMatchInlineSnapshot(`"CMX edit"`);
    expect(mockDispatch.mock.calls[0][0].type).toMatchInlineSnapshot(
      `"MUSA/PLAYER/UPDATE_MANY_BY_ID"`,
    );
  });

  it("calls api with updated tags and shows error on failure", async () => {
    vi.mocked(Api.writeTagsMany).mockResolvedValueOnce(new Error("err"));

    render(<MetadataEditor activeIndex={0} files={[audioFixture]} />, state);

    await userEvent.click(screen.getByText(saveButtonText));

    expect(Api.writeTagsMany).toHaveBeenCalledWith([
      {
        fid: expect.any(String),
        tags: {},
      },
    ]);
    expect(screen.getByText("err")).toBeInTheDocument();
  });
});
