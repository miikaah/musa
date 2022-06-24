import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { updateSettings } from "reducers/settings.reducer";

const Container = styled.div`
  display: grid;
  grid-template-columns: 5fr 50fr 10fr;

  > input:first-of-type {
    align-self: center;
  }

  > input:not(:first-of-type) {
    max-width: 70px;
    padding: 0 12px;
  }

  > label {
    margin: 16px 0;
  }
`;

const UseFirFile = ({
  isInit,
  name,
  filename,
  useFir,
  firMakeUpGainDb,
  firFile,
  firFiles,
  dispatch,
}) => {
  const [firMakeUpGainValue, setFirMakeUpGainValue] = useState(
    firFiles[filename]?.makeUpGain || 0
  );
  const checkboxId = `${filename}-toggle`;

  if (!isInit) {
    return null;
  }

  const toggleFir = (event) => {
    event.target.blur();

    dispatch(
      updateSettings({
        firMakeUpGainDb: event.target.checked ? firMakeUpGainValue : 0,
        firFile: event.target.checked
          ? filename
          : filename !== firFile
          ? filename
          : "",
      })
    );
  };

  const updateFirMakeUpGain = (event) => {
    const integer = parseInt(event.target.value);

    if (isNaN(integer)) {
      setFirMakeUpGainValue("");
      return;
    }

    setFirMakeUpGainValue(integer);
    dispatch(
      updateSettings({
        firMakeUpGainDb: integer,
        firFiles: {
          ...firFiles,
          [filename]: {
            name,
            makeUpGain: integer,
          },
        },
      })
    );
  };

  return (
    <Container>
      <input
        id={checkboxId}
        type="checkbox"
        onChange={toggleFir}
        checked={firFile === filename}
      />
      <label htmlFor={checkboxId}>{name}</label>
      <input
        placeholder="db"
        step="1"
        min="0"
        max="30"
        type="number"
        disabled={firFile !== filename}
        value={firMakeUpGainValue}
        onChange={updateFirMakeUpGain}
      />
    </Container>
  );
};

export default connect(
  (state) => ({
    isInit: state.settings.isInit,
    firFile: state.settings.firFile,
    firFiles: state.settings.firFiles,
  }),
  (dispatch) => ({ dispatch })
)(UseFirFile);
