import React from "react";
import styled from "styled-components/macro";

const ThemeBlockContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  width: 80px;
  height: 80px;
  margin: 0 10px 10px 0;
  background-color: ${({ rgb }) => rgb && `rgb(${rgb})`};
`;

const Color = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: ${({ rgb }) => rgb && `rgb(${rgb})`};
`;

const ThemeBlock = ({ theme, setCurrentTheme }) => {
  if (!theme) {
    return null;
  }

  const { colors: themeColors, key } = theme;
  const colors = themeColors || theme;

  if (!colors) {
    return null;
  }

  return (
    <ThemeBlockContainer
      title={key ? decodeURIComponent(key) : ""}
      rgb={colors.bg}
      onClick={() => setCurrentTheme(colors)}
    >
      <Color rgb={colors.primary} />
      <Color rgb={colors.secondary} />
    </ThemeBlockContainer>
  );
};

export default ThemeBlock;
