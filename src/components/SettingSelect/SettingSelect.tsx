import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ArrowDown as ArrowDownStyled } from "../../common.styles";
import { SettingsState } from "../../reducers/settings.reducer";

const StyledSettingSelect = styled.div`
  position: relative;

  select {
    appearance: none;
    width: 200px;
    padding: 10px;
    font-size: var(--font-size-sm);
    border-radius: 0;
    background-color: var(--color-primary-highlight);
    color: var(--color-typography-primary);
    cursor: pointer;
    border-color: transparent;
  }
`;

const ArrowDown = styled(ArrowDownStyled)`
  position: absolute;
  left: 170px;
  top: 15px;
  pointer-events: none;
`;

type SettingSelectProps = {
  isInit: SettingsState["isInit"];
  children: React.ReactNode;
};

const SettingSelect = ({ isInit, children }: SettingSelectProps) => {
  if (!isInit) {
    return null;
  }

  return (
    <StyledSettingSelect>
      {children}
      <ArrowDown data-testid="SettingSelectArrowDown" />
    </StyledSettingSelect>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  isInit: state.settings.isInit,
}))(SettingSelect);
