import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";

const Container = styled.div`
  display: grid;
  grid-template-columns: 5fr 50fr 10fr;

  > input:first-of-type {
    align-self: center;
  }

  > input:not(:first-of-type) {
    max-width: 70px;
    padding: 0 12px;
    max-height: 30px;
  }

  > label {
    margin: 8px 0 8px 0;
    font-size: var(--font-size-xs);
  }
`;

type UseFirFileProps = {
  isInit: SettingsState["isInit"];
  name: string;
  filename: string;
  firFile: SettingsState["firFile"];
  firFiles: SettingsState["firFiles"];
};

const UseFirFile = ({
  isInit,
  name,
  filename,
  firFile,
  firFiles,
}: UseFirFileProps) => {
  const [firMakeUpGainValue, setFirMakeUpGainValue] = useState(
    firFiles[filename]?.makeUpGain || 0,
  );
  const checkboxId = `${filename}-toggle`;
  const dispatch = useDispatch();

  if (!isInit) {
    return null;
  }

  const toggleFir = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.blur();

    dispatch(
      updateSettings({
        firMakeUpGainDb: event.target.checked ? firMakeUpGainValue : 0,
        firFile: event.target.checked
          ? filename
          : filename !== firFile
          ? filename
          : "",
      }),
    );
  };

  const updateFirMakeUpGain = (event: React.ChangeEvent<HTMLInputElement>) => {
    const integer = parseInt(event.target.value);

    if (isNaN(integer)) {
      setFirMakeUpGainValue(0);
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
      }),
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

export default connect((state: { settings: SettingsState }) => ({
  isInit: state.settings.isInit,
  firFile: state.settings.firFile,
  firFiles: state.settings.firFiles,
}))(UseFirFile);
