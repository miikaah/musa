import React from "react";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash-es";
import styled from "styled-components/macro";
import { prefixNumber } from "../util";

const Colors = {
  DrGood: "#90ff00",
  DrMediocre: "#ffe02f",
  DrBad: "#f00"
};

const DynamicRangeContainer = styled.span`
  color: var(--color-white);
  background-color: var(--color-black);
  margin: 0 12px;
  padding: 0 2px 7px;
  visibility: ${({ isHidden }) => isHidden && "hidden"};
`;

const DynamicRange = styled.span`
  font-weight: bold;
  border-style: solid;
  border-color: ${({ dr }) => {
    if (dr > 11) return Colors.DrGood;
    else if (dr > 8 && dr < 12) return Colors.DrMediocre;
    else if (dr < 9) return Colors.DrBad;
  }};
  border-width: 0;
  border-bottom-width: 2px;
`;

const PlayerDrGauge = ({ currentItem }) => {
  const dr = get(currentItem, "metadata.dynamicRange", "");
  return (
    <DynamicRangeContainer isHidden={isEmpty(dr)}>
      <DynamicRange dr={dr}>
        {isEmpty(dr) ? "DR00" : `DR${prefixNumber(dr)}`}
      </DynamicRange>
    </DynamicRangeContainer>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerDrGauge);
