import React from "react";
import styled from "styled-components/macro";

const Container = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  width: 80px;
  height: 80px;
  background-color: ${({ rgb }) => rgb && `rgb(${rgb})`};
  margin: ${({ hasMargin }) => hasMargin && `0 10px 10px 0`};
`;

const Color = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: ${({ rgb }) => rgb && `rgb(${rgb})`};
`;

const ThemeBlock = ({ theme, setCurrentTheme, hasMargin = true }) => {
  if (!theme) {
    return null;
  }

  const { colors: themeColors, id } = theme;
  const colors = themeColors || theme;

  if (!colors) {
    return null;
  }

  return (
    <Container
      title={id ? decodeURIComponent(id) : ""}
      rgb={colors.bg}
      onClick={() => setCurrentTheme(colors)}
      hasMargin={hasMargin}
    >
      <Color rgb={colors.primary} />
      <Color rgb={colors.secondary} />
    </Container>
  );
};

export default ThemeBlock;
