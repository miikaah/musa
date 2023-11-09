import React from "react";
import { screen } from "@testing-library/react";
import UseFirSetting from "./UseFirSetting";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { firFiles } from "../../reducers/settings.reducer";

const t = translate("en");
const impulseResponseEqText = String(
  t("settings.experimental.impulseResponseEq"),
);

const state = {
  settings: {
    t,
    isInit: true,
    firFiles,
  },
};

const state2 = {
  ...state,
  settings: {
    ...state.settings,
    isInit: false,
    firFiles,
  },
};

describe("UseFirSetting", () => {
  it("renders UseFirSetting component", async () => {
    render(<UseFirSetting />, state);

    expect(screen.getByText(impulseResponseEqText)).toBeInTheDocument();
    expect(screen.getAllByTestId("FirFile").length > 0).toBe(true);
  });

  it("renders null when not isInit", async () => {
    render(<UseFirSetting />, state2);

    expect(screen.queryByText(impulseResponseEqText)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("FirFile").length).toBe(0);
  });
});
