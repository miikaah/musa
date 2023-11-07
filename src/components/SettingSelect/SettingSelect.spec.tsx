import React from "react";
import { screen } from "@testing-library/react";
import SettingSelect from "./SettingSelect";
import { render } from "../../../test/render";

const mockText = "mock";

const state = {
  settings: { isInit: true },
};

const state2 = {
  settings: { isInit: false },
};

describe("SettingSelect", () => {
  it("renders SettingSelect component", async () => {
    render(
      <SettingSelect>
        <p>{mockText}</p>
      </SettingSelect>,
      state,
    );

    expect(screen.getByText(mockText)).toBeInTheDocument();
    expect(screen.getByTestId("SettingSelectArrowDown")).toBeInTheDocument();
  });

  it("renders null when not isInit", async () => {
    render(
      <SettingSelect>
        <p>{mockText}</p>
      </SettingSelect>,
      state2,
    );

    expect(screen.queryByText(mockText)).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("SettingSelectArrowDown"),
    ).not.toBeInTheDocument();
  });
});
