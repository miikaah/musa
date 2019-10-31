import React, { useEffect } from "react";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash-es";
import { prefixNumber } from "../util";
import { Colors } from "../App.jsx";
import "./PlayerDrGauge.scss";

const PlayerDrGauge = ({ currentItem }) => {
  const dr = get(currentItem, "metadata.dynamicRange", "");
  let className = "player-dynamic-range-wrapper";

  if (isEmpty(dr)) className += " hidden";

  useEffect(() => {
    const setDrLevelColor = () => {
      const dr = get(currentItem, "metadata.dynamicRange");
      if (!dr) return;

      let color;
      if (dr > 11) color = Colors.DrGood;
      if (dr > 8 && dr < 12) color = Colors.DrMediocre;
      if (dr < 9) color = Colors.DrBad;
      document.body.style.setProperty("--color-dr-level", color);
    };

    setDrLevelColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  return (
    <span className={className}>
      <span className="player-dynamic-range">
        {isEmpty(dr) ? "DR00" : `DR${prefixNumber(dr)}`}
      </span>
    </span>
  );
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(PlayerDrGauge);
