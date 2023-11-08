import { Theme } from "@miikaah/musa-core";
import React from "react";
import { connect, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { updateCurrentTheme } from "../../util";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import ThemeBlock from "../ThemeBlock";
import Button from "../Button";
import Api from "../../apiClient";
import { FALLBACK_THEME } from "../../config";
import { TranslateFn } from "../../i18n";

const Container = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  grid-column-gap: 40px;
  margin-bottom: 40px;
`;

const CurrentThemeContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const CurrentTheme = styled.div``;

const ThemeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RemoveThemeButton = styled(Button)`
  width: 200px;
  margin-top: 12px;
`;

const themeStyles = css`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  max-height: 300px;
`;

const ThemeList = styled.div`
  ${themeStyles}
  padding: 12px 0 0 12px;
  overflow-y: auto;
  min-height: 300px;
`;

const ThemeList2 = styled.div`
  ${themeStyles}
  padding: 12px;
  max-width: 104px;
`;

const NoThemes = styled.div`
  width: 100%;
  text-align: center;
  color: #000;
  padding-bottom: 12px;
`;

type ThemeLibraryProps = {
  currentTheme: SettingsState["currentTheme"];
  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  t: TranslateFn;
};

const ThemeLibrary = ({
  currentTheme,
  themes,
  setThemes,
  t,
}: ThemeLibraryProps) => {
  const hasThemes = Array.isArray(themes) && themes.length > 0;
  const dispatch = useDispatch();

  const changeCurrentTheme = (theme: Theme) => {
    updateCurrentTheme(theme.colors);
    dispatch(updateSettings({ currentTheme: theme }));
  };

  const removeTheme = async () => {
    const { id } = currentTheme;

    await Api.removeTheme({ id });

    setThemes(themes.filter((t) => t.id !== id));
    updateCurrentTheme(FALLBACK_THEME);
    dispatch(
      updateSettings({
        currentTheme: {
          colors: FALLBACK_THEME,
          filename: "",
          id: "",
        },
      }),
    );
  };

  return (
    <Container>
      <div>
        <h5>
          {t("settings.theme.collection")} ({themes.length})
        </h5>
        <ThemeList>
          {hasThemes &&
            themes.map((theme) => (
              <ThemeBlock
                key={theme.id}
                currentTheme={theme}
                setCurrentTheme={changeCurrentTheme}
                dataTestId="ThemeLibraryThemeBlock"
              />
            ))}
          {!hasThemes && <NoThemes>{t("settings.theme.noThemes")}</NoThemes>}
        </ThemeList>
      </div>
      <CurrentThemeContainer>
        <CurrentTheme>
          <h5>{t("settings.theme.currentTheme")}</h5>
          <ThemeWrapper>
            <ThemeList2>
              <ThemeBlock
                currentTheme={currentTheme}
                hasMargin={false}
                setCurrentTheme={() => {}}
              />
            </ThemeList2>
            {hasThemes && (
              <RemoveThemeButton onClick={removeTheme} isSecondary>
                {t("settings.theme.removeTheme")}
              </RemoveThemeButton>
            )}
          </ThemeWrapper>
        </CurrentTheme>
      </CurrentThemeContainer>
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  currentTheme: state.settings.currentTheme,
  t: state.settings.t,
}))(ThemeLibrary);
