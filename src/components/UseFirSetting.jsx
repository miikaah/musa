import React from "react";
import { connect } from "react-redux";
import { firFileMap } from "config";
import UseFirFile from "./UseFirFile";
import styled from "styled";

const FirFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 486px;
`;

const UseFirSetting = ({ isInit }) => {
  if (!isInit) {
    return null;
  }

  return (
    <>
      <h5>Impulse response EQ</h5>
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
  }),
  (dispatch) => ({ dispatch }),
)(UseFirSetting);
