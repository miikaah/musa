import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { firFileMap } from "../config";
import UseFirFile from "./UseFirFile";
import { SettingsState } from "../reducers/settings.reducer";
import { TranslateFn } from "../i18n";

const FirFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 486px;
`;

type UseFirSettingProps = { isInit: SettingsState["isInit"]; t: TranslateFn };

const UseFirSetting = ({ isInit, t }: UseFirSettingProps) => {
  if (!isInit) {
    return null;
  }

  return (
    <>
      <h5>{t("settings.experimental.impulseResponseEq")}</h5>
      <FirFilesContainer>
        {Object.entries(firFileMap).map(([name, filename]) => (
          <UseFirFile key={filename} name={name} filename={filename} />
        ))}
      </FirFilesContainer>
    </>
  );
};

export default connect(
  (state: { settings: SettingsState }) => ({
    isInit: state.settings.isInit,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(UseFirSetting);
