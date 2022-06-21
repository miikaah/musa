import React from "react";
import styled from "styled-components/macro";

const Container = styled.span.attrs(({ rgb }) => ({
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
`;

const Color = styled.span.attrs(({ rgb }) => ({
  style: {
    backgroundColor: rgb && `rgb(${rgb})`,
  },
}))`
  display: inline-block;
  width: 30px;
  height: 30px;
`;

const ThemeBlock = ({ theme, setCurrentTheme, hasMargin = true }) => {
  if (!theme) {
    return null;
  }

  const { colors, filename } = theme;

  if (!colors) {
    return null;
  }

  return (
    <Container
      title={filename || ""}
      rgb={colors.bg}
      onClick={() => setCurrentTheme(theme)}
      hasMargin={hasMargin}
    >
      <Color rgb={colors.primary} />
      <Color rgb={colors.secondary} />
    </Container>
  );
};

export default ThemeBlock;
