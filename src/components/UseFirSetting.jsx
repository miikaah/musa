import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { firFileMap } from "config";
import UseFirFile from "./UseFirFile";

const FirFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 486px;
`;

const UseFirSetting = ({ isInit, t }) => {
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
  (state) => ({
    isInit: state.settings.isInit,
    t: state.settings.t,
  }),
  (dispatch) => ({ dispatch }),
)(UseFirSetting);
