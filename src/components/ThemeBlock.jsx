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

const PrimaryOrSecondaryColor = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: ${({ rgb }) => rgb && `rgb(${rgb})`};
`;

const ThemeBlock = ({ colors, setCurrentTheme }) => {
  if (!colors) return null;
  return (
    <ThemeBlockContainer
      rgb={colors.bg}
      onClick={() => setCurrentTheme(colors)}
    >
      <PrimaryOrSecondaryColor rgb={colors.primary} />
      <PrimaryOrSecondaryColor rgb={colors.secondary} />
    </ThemeBlockContainer>
  );
};

export default ThemeBlock;
