import React from "react";
import { styledWithPropFilter } from "styled";

const Container = styledWithPropFilter("span").attrs(({ rgb }) => ({
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

const Color = styledWithPropFilter("span").attrs(({ rgb }) => ({
  style: {
    backgroundColor: rgb && `rgb(${rgb})`,
  },
}))`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  border-color: ${({ isEditing }) => isEditing && "#f00"};
`;

const ThemeBlock = ({
  className,
  currentTheme,
  setCurrentTheme,
  hasMargin = true,
  isThemeEditor = false,
  editTarget,
  setEditTarget,
}) => {
  if (!currentTheme) {
    return null;
  }

  const { colors, filename } = currentTheme;

  if (!colors) {
    return null;
  }

  const setEditTargetToBg = (event) => {
    event.preventDefault();

    // This is parent click
    if (event.target === event.currentTarget) {
      setEditTarget(editTarget === "bg" ? "" : "bg");
    }
  };

  return (
    <Container
      className={className}
      title={filename || ""}
      rgb={colors.bg}
      onClick={(event) =>
        isThemeEditor ? setEditTargetToBg(event) : setCurrentTheme(currentTheme)
      }
      hasMargin={isThemeEditor ? false : hasMargin}
      isEditing={editTarget === "bg"}
    >
      <Color
        rgb={colors.primary}
        isEditing={editTarget === "primary"}
        onClick={() => setEditTarget(editTarget === "primary" ? "" : "primary")}
      />
      <Color
        rgb={colors.secondary}
        isEditing={editTarget === "secondary"}
        onClick={() =>
          setEditTarget(editTarget === "secondary" ? "" : "secondary")
        }
      />
    </Container>
  );
};

export default ThemeBlock;
