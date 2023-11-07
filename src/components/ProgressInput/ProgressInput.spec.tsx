import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import ProgressInput from "./ProgressInput";
import { render } from "../../../test/render";

const mockHandleMouseDown = vi.fn();
const mockHandleMouseMove = vi.fn();

describe("ProgressInput", () => {
  it("renders ProgressInput component", async () => {
    render(
      <ProgressInput
        progress={42}
        width={120}
        handleMouseDown={mockHandleMouseDown}
        handleMouseMove={mockHandleMouseMove}
      />,
      {},
    );

    expect(screen.getByTestId("ProgressInput")).toBeInTheDocument();
    expect(screen.getByTestId("ProgressInputForeground")).toBeInTheDocument();
    expect(screen.getByTestId("ProgressInputForeground")).toHaveStyle(
      "transform: translateX(-42%)",
    );
  });

  it("calls handleMouseDown click handler", async () => {
    render(
      <ProgressInput
        progress={42}
        width={120}
        handleMouseDown={mockHandleMouseDown}
        handleMouseMove={mockHandleMouseMove}
      />,
      {},
    );

    fireEvent.mouseDown(screen.getByTestId("ProgressInput"));

    expect(mockHandleMouseDown).toHaveBeenCalledOnce();
  });

  it("calls handleMouseMove click handler", async () => {
    render(
      <ProgressInput
        progress={42}
        width={120}
        handleMouseDown={mockHandleMouseDown}
        handleMouseMove={mockHandleMouseMove}
      />,
      {},
    );

    fireEvent.mouseMove(screen.getByTestId("ProgressInput"));

    expect(mockHandleMouseMove).toHaveBeenCalledOnce();
  });
});
