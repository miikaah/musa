import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreAmpSetting from "./PreAmpSetting";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const t = translate("en");
const preAmpText = `${String(t("settings.experimental.preAmp"))} dB`;

const state = {
  settings: {
    isInit: true,
    t,
    preAmpDb: 0,
  },
};

const state2 = {
  ...state,
  settings: {
    ...state.settings,
    isInit: false,
  },
};

describe("PreAmpSetting", () => {
  it("renders PreAmpSetting component", async () => {
    render(<PreAmpSetting />, state);

    expect(screen.getByText(preAmpText)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders null when not isInit", async () => {
    render(<PreAmpSetting />, state2);

    expect(screen.queryByText(preAmpText)).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("dispatches change preAmpDb action when input is changed", async () => {
    render(<PreAmpSetting />, state);

    await userEvent.type(screen.getByRole("spinbutton"), "5");

    expect(screen.getByRole("spinbutton")).toHaveValue(5);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { preAmpDb: 5 } }),
    );
  });
});
