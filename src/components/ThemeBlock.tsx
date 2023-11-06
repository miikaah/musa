import React from "react";
import styled from "styled-components";
import { SettingsState } from "../reducers/settings.reducer";

const Container = styled.span.attrs<{
  rgb: number[];
  hasMargin: boolean;
  isEditing: boolean;
}>(({ rgb }) => ({
  style: {
    backgroundColor: rgb && `rgb(${rgb})`,
  },
}))`
  display: flex;
  justify-content: center;
  cursor: pointer;
  width: 80px;
  height: 80px;
  margin: ${({ hasMargin }) => hasMargin && `0 10px 10px 0`};
  border: 1px solid transparent;
  border-color: ${({ isEditing }) => isEditing && "#f00"};
`;

const Color = styled.span.attrs<{ rgb: number[]; isEditing: boolean }>(
  ({ rgb }) => ({
    style: {
      backgroundColor: rgb && `rgb(${rgb})`,
    },
  }),
)`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  border-color: ${({ isEditing }) => isEditing && "#f00"};
`;

export type EditTarget = "bg" | "primary" | "secondary" | null;

type ThemeBlockProps = {
  currentTheme: SettingsState["currentTheme"];
  isThemeEditor?: boolean;
  editTarget?: EditTarget;
  setEditTarget?: (target: EditTarget) => void;
  className?: string;
  hasMargin?: boolean;
  setCurrentTheme?: (theme: SettingsState["currentTheme"]) => void;
};

const ThemeBlock = ({
  className,
  currentTheme,
  setCurrentTheme,
  hasMargin = true,
  isThemeEditor = false,
  editTarget,
  setEditTarget,
}: ThemeBlockProps) => {
  if (!currentTheme) {
    return null;
  }

  const { colors, filename } = currentTheme;

  if (!colors) {
    return null;
  }

  const setEditTargetToBg = (event: React.MouseEvent) => {
    event.preventDefault();

    // This is parent click
    if (event.target === event.currentTarget && setEditTarget) {
      setEditTarget(editTarget === "bg" ? null : "bg");
    }
  };

  return (
    <Container
      className={className}
      title={filename || ""}
      rgb={colors.bg}
      onClick={(event: React.MouseEvent) => {
        if (isThemeEditor) {
          setEditTargetToBg(event);
        } else if (setCurrentTheme) {
          setCurrentTheme(currentTheme);
        }
      }}
      hasMargin={isThemeEditor ? false : hasMargin}
      isEditing={editTarget === "bg"}
      data-testid="ThemeBlockContainer"
    >
      <Color
        rgb={colors.primary}
        isEditing={editTarget === "primary"}
        onClick={() =>
          setEditTarget &&
          setEditTarget(editTarget === "primary" ? null : "primary")
        }
      />
      <Color
        rgb={colors.secondary}
        isEditing={editTarget === "secondary"}
        onClick={() =>
          setEditTarget &&
          setEditTarget(editTarget === "secondary" ? null : "secondary")
        }
      />
    </Container>
  );
};

export default ThemeBlock;
