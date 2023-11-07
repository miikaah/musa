import React from "react";
import { screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";
import { render } from "../../../test/render";

const state = {
  library: {
    scanLength: 100,
    scannedLength: 10,
    scanColor: "#f00",
  },
};

const state2 = {
  ...state,
  library: {
    ...state.library,
    scannedLength: 0,
  },
};

describe("ProgressBar", () => {
  it("renders ProgressBar component", async () => {
    render(<ProgressBar />, state);

    expect(screen.getByTestId("ProgressBarValue")).toBeInTheDocument();
    expect(screen.getByTestId("ProgressBarValue")).toHaveStyle("width: 10%");
  });

  it("renders null when scan length is below 1 %", async () => {
    render(<ProgressBar />, state2);

    expect(screen.queryByText("ProgressBarValue")).not.toBeInTheDocument();
  });
});
