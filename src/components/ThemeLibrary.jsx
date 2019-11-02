import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { FALLBACK_THEME } from "../config";
import { doIdbRequest, updateCurrentTheme } from "../util";
import { updateSettings } from "reducers/settings.reducer";
import ThemeBlock from "./ThemeBlock";
import Button from "./Button";

const ThemeLibraryContainer = styled.div``;

const DefaultAndCurrentThemes = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const DefaultTheme = styled.div`
  flex: 50%;
  margin-right: 40px;
`;

const CurrentTheme = styled.div`
  flex: 50%;
`;

const ThemeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ThemeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 10px 0 0 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const ThemeControls = styled.div`
  margin-left: 20px;
`;

const ThemeLibrary = ({ defaultTheme, currentTheme, update, dispatch }) => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    doIdbRequest({
      method: "getAll",
      storeName: "theme",
      onReqSuccess: req => () => setThemes(req.result)
    });
  }, [update]);

  const handleDefaultThemeChange = theme => {
    updateCurrentTheme(theme);
    dispatch(updateSettings({ defaultTheme: theme, currentTheme: theme }));
  };

  const handleCurrentThemeChange = theme => {
    updateCurrentTheme(theme);
    dispatch(updateSettings({ currentTheme: theme }));
  };

  return (
    <ThemeLibraryContainer>
      <DefaultAndCurrentThemes>
        <DefaultTheme>
          <h5>Default theme</h5>
          <ThemeWrapper>
            <ThemeList>
              <ThemeBlock colors={defaultTheme} />
            </ThemeList>
            <ThemeControls>
              <Button
                onClick={() => handleDefaultThemeChange(FALLBACK_THEME)}
                isSmall
                isSecondary
              >
                Set to factory default
              </Button>
            </ThemeControls>
          </ThemeWrapper>
        </DefaultTheme>

        <CurrentTheme>
          <h5>Current theme</h5>
          <ThemeWrapper>
            <ThemeList>
              <ThemeBlock colors={currentTheme} />
            </ThemeList>
            <ThemeControls>
              <Button
                onClick={() => handleDefaultThemeChange(currentTheme)}
                isSmall
                isPrimary
              >
                Set as default theme
              </Button>
            </ThemeControls>
          </ThemeWrapper>
        </CurrentTheme>
      </DefaultAndCurrentThemes>

      <h5>Library</h5>
      <ThemeList>
        {themes &&
          themes.map((theme, i) => (
            <ThemeBlock
              key={i}
              colors={theme.colors}
              setCurrentTheme={theme => handleCurrentThemeChange(theme)}
            />
          ))}
      </ThemeList>
    </ThemeLibraryContainer>
  );
};

export default connect(
  state => ({
    defaultTheme: state.settings.defaultTheme,
    currentTheme: state.settings.currentTheme
  }),
  dispatch => ({ dispatch })
)(ThemeLibrary);
