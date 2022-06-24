import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { firFileMap } from "config";
import UseFirFile from "./UseFirFile";

const FirFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom 100px;
  max-width: 486px;
`;

const UseFirSetting = ({ isInit }) => {
  if (!isInit) {
    return null;
  }

  return (
    <>
      <h5>Use FIR</h5>
      <FirFilesContainer>
        {Object.entries(firFileMap).map(([name, filename], i) => (
          <UseFirFile key={`fir-file-${i}`} name={name} filename={filename} />
        ))}
      </FirFilesContainer>
    </>
  );
};

export default connect(
  (state) => ({
    isInit: state.settings.isInit,
  }),
  (dispatch) => ({ dispatch })
)(UseFirSetting);
