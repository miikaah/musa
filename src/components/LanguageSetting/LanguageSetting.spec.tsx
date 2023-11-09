import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSetting from "./LanguageSetting";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const t = translate("en");
const enText = String(t("settings.language.en"));
const fiText = String(t("settings.language.fi"));

const state = {
  settings: {
    isInit: true,
    language: "en",
    t,
  },
};

describe("LanguageSetting", () => {
  it("renders LanguageSetting component", async () => {
    render(<LanguageSetting />, state);

    expect(
      screen.getByRole<HTMLOptionElement>("option", { name: enText }).selected,
    ).toBe(true);
    expect(
      screen.getByRole<HTMLOptionElement>("option", { name: fiText }).selected,
    ).toBe(false);
  });

  it("dispatches language change action", async () => {
    render(<LanguageSetting />, state);

    await userEvent.selectOptions(screen.getByRole("combobox"), ["fi"]);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { language: "fi" } }),
    );
  });
});
