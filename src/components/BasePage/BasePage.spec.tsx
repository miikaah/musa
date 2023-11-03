import React from "react";
import { screen } from "@testing-library/react";
import BasePage from "./BasePage";
import { render } from "../../../test/render";

const state = {};

describe("BasePage", () => {
  it("renders BasePage component", async () => {
    render(<BasePage children={<button></button>} />, state);

    expect(screen.getByTestId("BasePageContainer")).toBeInTheDocument();
    expect(screen.getByTestId("BasePageWrapper")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
