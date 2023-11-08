import React from "react";
import { screen } from "@testing-library/react";
import Toolbar from "./Toolbar";
import Player from "../Player";
import { render } from "../../../test/render";

vi.mock("../Player", () => ({
  default: vi.fn(),
}));

describe("Toolbar", () => {
  it("renders Toolbar component", async () => {
    render(<Toolbar />, {});

    expect(screen.getByTestId("ToolbarContainer")).toBeInTheDocument();
    expect(Player).toHaveBeenCalledOnce();
  });
});
