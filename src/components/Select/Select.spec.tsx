import React from "react";
import { screen } from "@testing-library/react";
import Select from "./Select";
import { render } from "../../../test/render";

const mockText = "mock";

describe("Select", () => {
  it("renders Select component", async () => {
    render(
      <Select showSelect={true} maxWidth={420}>
        <p>{mockText}</p>
      </Select>,
      {},
    );

    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it("renders null when showSelect is false", async () => {
    render(
      <Select showSelect={false} maxWidth={420}>
        <p>{mockText}</p>
      </Select>,
      {},
    );

    expect(screen.queryByText(mockText)).not.toBeInTheDocument();
  });
});
