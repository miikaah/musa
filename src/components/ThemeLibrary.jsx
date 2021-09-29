import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { FALLBACK_THEME } from "../config";
import { updateCurrentTheme } from "../util";
import { updateSettings } from "reducers/settings.reducer";
import ThemeBlock from "./ThemeBlock";
import Button from "./Button";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

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
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const ThemeControls = styled.div`
  margin-left: 20px;
`;

const NoThemes = styled.div`
  width: 100%;
  text-align: center;
  color: #000;
`;

const ThemeLibrary = ({ defaultTheme, currentTheme, dispatch }) => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    if (ipc) {
      ipc.once("musa:themes:response:getAll", (event, themes) => {
        setThemes(themes);
      });
      ipc.send("musa:themes:request:getAll");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDefaultThemeChange = (theme) => {
    updateCurrentTheme(theme);
    dispatch(updateSettings({ defaultTheme: theme, currentTheme: theme }));
  };

  const handleCurrentThemeChange = (theme) => {
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
              <ThemeBlock theme={defaultTheme} hasMargin={false} />
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
              <ThemeBlock theme={currentTheme} hasMargin={false} />
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
        {themes.length > 0 &&
          themes.map((theme) => (
            <ThemeBlock
              key={theme.id}
              theme={theme}
              setCurrentTheme={(theme) => handleCurrentThemeChange(theme)}
            />
          ))}
        {themes.length < 1 && <NoThemes>No themes yet</NoThemes>}
      </ThemeList>
    </ThemeLibraryContainer>
  );
};

export default connect(
  (state) => ({
    defaultTheme: state.settings.defaultTheme,
    currentTheme: state.settings.currentTheme,
  }),
  (dispatch) => ({ dispatch })
)(ThemeLibrary);
