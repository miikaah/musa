import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MetadataEditor from "./MetadataEditor";
import { audioFixture } from "../../fixtures/audio.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { dispatchToast } from "../../util";
import * as Api from "../../apiClient";
import { getCodecInfo } from "./getCodecInfo";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../util");

vi.mock("../../apiClient");
vi.mocked(Api.writeTags).mockResolvedValue(undefined);

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

const tagUpdateSuccessText = String(t("toast.succeededToUpdateTags"));
const tagUpdateFailureText = String(t("toast.failedToUpdateTags"));

const state = {
  settings: { t },
};

describe("MetadataEditor", () => {
  it("renders MetadataEditor component", async () => {
    render(<MetadataEditor files={[audioFixture]} />, state);

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
    expect(screen.getByDisplayValue(codec)).toBeInTheDocument();

    expect(screen.getByText(commentText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(comment)).toBeInTheDocument();

    expect(screen.getByText(saveButtonText)).toBeInTheDocument();
  });

  it("calls api with updated tags and dispatches toast on success", async () => {
    render(<MetadataEditor files={[audioFixture]} />, state);

    const editedArtist = `${artist} edit`;
    const artistElement = screen.getByDisplayValue(artist);

    await userEvent.type(artistElement, " edit");
    await userEvent.click(screen.getByText(saveButtonText));

    expect(artistElement).toHaveValue(editedArtist);
    expect(Api.writeTags).toHaveBeenCalledWith(audioFixture.id, {
      artist: editedArtist,
    });
    expect(dispatchToast).toHaveBeenCalledWith(
      tagUpdateSuccessText,
      expect.any(String),
      expect.any(Function),
    );
  });

  it("calls api with updated tags and dispatches toast on failure", async () => {
    vi.mocked(Api.writeTags).mockResolvedValueOnce(new Error("err"));

    render(<MetadataEditor files={[audioFixture]} />, state);

    await userEvent.click(screen.getByText(saveButtonText));

    expect(Api.writeTags).toHaveBeenCalledWith(audioFixture.id, {});
    expect(dispatchToast).toHaveBeenCalledWith(
      tagUpdateFailureText,
      expect.any(String),
      expect.any(Function),
    );
  });
});
