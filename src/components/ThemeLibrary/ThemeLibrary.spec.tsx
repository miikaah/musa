import { Colors, Theme } from "@miikaah/musa-core";
import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeLibrary from "./ThemeLibrary";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { FALLBACK_THEME } from "../../config";
import { updateCurrentTheme } from "../../util";
import * as Api from "../../apiClient";

const mockSetThemes = vi.fn();

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../util");

vi.mock("../../apiClient");

const theme: Colors = {
  bg: [66, 37, 66],
  primary: [117, 53, 151],
  secondary: [33, 115, 126],
  slider: [117, 53, 151],
  typography: "#fbfbfb",
  typographyPrimary: "#fbfbfb",
  typographySecondary: "#fbfbfb",
  typographyGhost: "#d2d2d2",
};
const themes: Theme[] = [
  {
    colors: theme,
    filename: "foo",
    id: "bar",
  },
];

const t = translate("en");
const titleText = `${String(t("settings.theme.collection"))} (${
  themes.length
})`;
const noThemesText = String(t("settings.theme.noThemes"));
const currentThemeText = String(t("settings.theme.currentTheme"));
const removeThemeButtonText = String(t("settings.theme.removeTheme"));

const currentTheme = {
  colors: FALLBACK_THEME,
  filename: "",
  id: "",
};

const state = {
  settings: {
    t,
    currentTheme,
  },
};

const state2 = {
  settings: {
    t,
    currentTheme: themes[0],
  },
};

describe("ThemeLibrary", () => {
  it("renders ThemeLibrary component", async () => {
    render(<ThemeLibrary themes={themes} setThemes={mockSetThemes} />, state);

    expect(screen.getByText(titleText)).toBeInTheDocument();
    expect(screen.queryByText(noThemesText)).not.toBeInTheDocument();
    expect(screen.getByText(currentThemeText)).toBeInTheDocument();
    expect(screen.getByText(removeThemeButtonText)).toBeInTheDocument();
  });

  it("renders no themes message when no themes", async () => {
    render(<ThemeLibrary themes={[]} setThemes={mockSetThemes} />, state);

    expect(screen.getByText(noThemesText)).toBeInTheDocument();
    expect(screen.queryByText(removeThemeButtonText)).not.toBeInTheDocument();
  });

  it("calls side-effects when it clicks to change current theme", async () => {
    render(<ThemeLibrary themes={themes} setThemes={mockSetThemes} />, state);

    await userEvent.click(screen.getByTestId("ThemeLibraryThemeBlock"));

    expect(updateCurrentTheme).toHaveBeenCalledWith(theme);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { currentTheme: themes[0] } }),
    );
  });

  it("calls side-effects when it clicks to remove current theme", async () => {
    render(<ThemeLibrary themes={themes} setThemes={mockSetThemes} />, state2);

    await userEvent.click(screen.getByText(removeThemeButtonText));

    expect(Api.removeTheme).toHaveBeenCalledWith({ id: themes[0].id });
    expect(mockSetThemes).toHaveBeenCalledWith([]);
    expect(updateCurrentTheme).toHaveBeenCalledWith(FALLBACK_THEME);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { currentTheme } }),
    );
  });
});
