import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { updateCurrentTheme } from "../util";
import { updateSettings } from "reducers/settings.reducer";
import ThemeBlock from "./ThemeBlock";

const { REACT_APP_ENV, REACT_APP_API_BASE_URL: baseUrl } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
}

const ThemeLibraryContainer = styled.div``;

const CurrentThemeContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
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
  padding: ${({ hasAllPadding }) =>
    hasAllPadding ? "12px" : "12px 0 12px 12px"};
  max-height: 300px;
  overflow-y: auto;
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
    } else {
      fetch(`${baseUrl}/themes`)
        .then((r) => r.json())
        .then(({ themes }) => setThemes(themes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrentThemeChange = (theme) => {
    updateCurrentTheme(theme);
    dispatch(updateSettings({ currentTheme: theme }));
  };

  return (
    <ThemeLibraryContainer>
      <CurrentThemeContainer>
        <CurrentTheme>
          <h5>Current theme</h5>
          <ThemeWrapper>
            <ThemeList hasAllPadding>
              <ThemeBlock theme={currentTheme} hasMargin={false} />
            </ThemeList>
          </ThemeWrapper>
        </CurrentTheme>
      </CurrentThemeContainer>

      <h5>Library</h5>
      <ThemeList>
        {Array.isArray(themes) &&
          themes.map((theme) => (
            <ThemeBlock
              key={theme.id}
              theme={theme}
              setCurrentTheme={(theme) => handleCurrentThemeChange(theme)}
            />
          ))}
        {!Array.isArray(themes) ||
          (themes.length < 1 && <NoThemes>No themes yet</NoThemes>)}
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
