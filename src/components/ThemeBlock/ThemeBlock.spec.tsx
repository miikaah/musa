import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeBlock from "./ThemeBlock";
import { render } from "../../../test/render";
import { FALLBACK_THEME } from "../../config";

const mockSetCurrentTheme = vi.fn();
const mockSetEditTarget = vi.fn();

const theme = {
  colors: FALLBACK_THEME,
  filename: "",
  id: "",
};

describe("ThemeBlock", () => {
  it("renders ThemeBlock component", async () => {
    render(<ThemeBlock currentTheme={theme} />, {});

    expect(screen.getByTestId("ThemeBlockContainer")).toBeInTheDocument();
    expect(screen.getByTestId("ThemeBlockContainer")).toHaveStyle(
      "background-color: rgb(33, 37, 43)",
    );
    expect(screen.getByTestId("ThemeBlockColorPrimary")).toBeInTheDocument();
    expect(screen.getByTestId("ThemeBlockColorPrimary")).toHaveStyle(
      "background-color: rgb(117, 53, 151)",
    );
    expect(screen.getByTestId("ThemeBlockColorSecondary")).toBeInTheDocument();
    expect(screen.getByTestId("ThemeBlockColorSecondary")).toHaveStyle(
      "background-color: rgb(33, 115, 126)",
    );
  });

  it("calls setCurrentTheme click handler", async () => {
    render(
      <ThemeBlock currentTheme={theme} setCurrentTheme={mockSetCurrentTheme} />,
      {},
    );

    await userEvent.click(screen.getByTestId("ThemeBlockContainer"));

    expect(mockSetCurrentTheme).toHaveBeenCalledWith(theme);
  });

  describe("when isThemeEditor = true", () => {
    it("calls setEditTarget click handler for bg with null", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="bg"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockContainer"));

      expect(mockSetEditTarget).toHaveBeenCalledWith(null);
    });

    it("calls setEditTarget click handler for bg with bg", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="primary"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockContainer"));

      expect(mockSetEditTarget).toHaveBeenCalledWith("bg");
    });

    it("calls setEditTarget click handler for primary with null", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="primary"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockColorPrimary"));

      expect(mockSetEditTarget).toHaveBeenCalledWith(null);
    });

    it("calls setEditTarget click handler for primary with bg", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="bg"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockColorPrimary"));

      expect(mockSetEditTarget).toHaveBeenCalledWith("primary");
    });

    it("calls setEditTarget click handler for secondary with null", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="secondary"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockColorSecondary"));

      expect(mockSetEditTarget).toHaveBeenCalledWith(null);
    });

    it("calls setEditTarget click handler for primary with bg", async () => {
      render(
        <ThemeBlock
          currentTheme={theme}
          editTarget="bg"
          setEditTarget={mockSetEditTarget}
          isThemeEditor={true}
        />,
        {},
      );

      await userEvent.click(screen.getByTestId("ThemeBlockColorSecondary"));

      expect(mockSetEditTarget).toHaveBeenCalledWith("secondary");
    });
  });
});
