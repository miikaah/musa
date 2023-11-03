import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";
import { render } from "../../../test/render";

const mockOnClick = vi.fn();

const state = {};

describe("Button", () => {
  it("renders Button component", async () => {
    render(<Button children={<p>Click me</p>} onClick={mockOnClick} />, state);

    expect(screen.getByTestId("ButtonContainer")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler on click", async () => {
    render(<Button children={<p>Click me</p>} onClick={mockOnClick} />, state);

    await userEvent.click(screen.getByTestId("ButtonContainer"));

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("allows to pass className", async () => {
    render(
      <Button
        children={<p>Click me</p>}
        onClick={mockOnClick}
        className="foo"
      />,
      state,
    );

    expect(
      screen.getByTestId("ButtonContainer").className.includes("foo"),
    ).toBe(true);
  });

  it("allows to pass disabled", async () => {
    render(
      <Button
        children={<p>Click me</p>}
        onClick={mockOnClick}
        disabled={true}
      />,
      state,
    );

    expect(
      (screen.getByTestId("ButtonContainer") as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
