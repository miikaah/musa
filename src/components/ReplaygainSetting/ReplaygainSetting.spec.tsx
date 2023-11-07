import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReplaygainSetting from "./ReplaygainSetting";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { REPLAYGAIN_TYPE } from "../../config";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const t = translate("en");
const trackText = String(t("settings.advanced.normalization.track"));
const albumText = String(t("settings.advanced.normalization.album"));
const offText = String(t("settings.advanced.normalization.off"));

const state = {
  settings: {
    isInit: true,
    replaygainType: REPLAYGAIN_TYPE.Album,
    t,
  },
};

describe("ReplaygainSetting", () => {
  it("renders ReplaygainSetting component", async () => {
    render(<ReplaygainSetting />, state);

    expect(screen.getByText(trackText)).toBeInTheDocument();
    expect(screen.getByText(albumText)).toBeInTheDocument();
    expect(screen.getByText(offText)).toBeInTheDocument();
  });

  it("dispatches replayGain type change action", async () => {
    render(<ReplaygainSetting />, state);

    await userEvent.selectOptions(screen.getByRole("combobox"), [
      REPLAYGAIN_TYPE.Track,
    ]);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        props: { replaygainType: REPLAYGAIN_TYPE.Track },
      }),
    );
  });
});
