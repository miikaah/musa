import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { updateCurrentTheme } from "../util";
import { updateSettings } from "reducers/settings.reducer";
import { FALLBACK_THEME } from "../config";
import ThemeBlock from "./ThemeBlock";
import Button from "./Button";

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

const RemoveThemeButton = styled(Button)`
  max-width: 180px;
  max-height: 50px;
  margin-left: 12px;
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

const ThemeLibrary = ({ currentTheme, dispatch }) => {
  const [themes, setThemes] = useState([]);
  const hasThemes = Array.isArray(themes) && themes.length > 0;

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

  const changeCurrentTheme = (theme) => {
    updateCurrentTheme(theme.colors);
    dispatch(updateSettings({ currentTheme: theme }));
  };

  const removeTheme = () => {
    if (ipc) {
      ipc.once("musa:themes:response:remove", () => {
        setThemes(themes.filter((t) => t.id !== currentTheme.id));
        updateCurrentTheme(FALLBACK_THEME);
        dispatch(updateSettings({ currentTheme: FALLBACK_THEME }));
      });
      ipc.send("musa:themes:request:remove", currentTheme.id);
    }
  };

  return (
    <ThemeLibraryContainer>
      <CurrentThemeContainer>
        <CurrentTheme>
          <h5>Current theme</h5>
          <ThemeWrapper>
            <ThemeList hasAllPadding>
              <ThemeBlock
                theme={currentTheme}
                hasMargin={false}
                setCurrentTheme={() => {}}
              />
            </ThemeList>
            {hasThemes && ipc && (
              <RemoveThemeButton onClick={removeTheme} isSecondary>
                Remove theme
              </RemoveThemeButton>
            )}
          </ThemeWrapper>
        </CurrentTheme>
      </CurrentThemeContainer>

      <h5>Library ({hasThemes ? themes.length : 0} themes)</h5>
      <ThemeList>
        {hasThemes &&
          themes.map((theme) => (
            <ThemeBlock
              key={theme.id}
              theme={theme}
              setCurrentTheme={changeCurrentTheme}
            />
          ))}
        {!hasThemes && <NoThemes>No themes yet</NoThemes>}
      </ThemeList>
    </ThemeLibraryContainer>
  );
};

export default connect(
  (state) => ({
    currentTheme: state.settings.currentTheme,
  }),
  (dispatch) => ({ dispatch })
)(ThemeLibrary);
