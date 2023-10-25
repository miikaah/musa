import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ArrowDown as ArrowDownStyled } from "common.styles";

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

const SettingSelect = ({ isInit, children }) => {
  if (!isInit) {
    return null;
  }

  return (
    <StyledSettingSelect>
      {children}
      <ArrowDown />
    </StyledSettingSelect>
  );
};

export default connect(
  (state) => ({
    isInit: state.settings.isInit,
  }),
  (dispatch) => ({ dispatch }),
)(SettingSelect);
