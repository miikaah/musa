import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditorInput from "./EditorInput";
import { render } from "../../../test/render";

const mockUpdateValue = vi.fn();

describe("EditorInput", () => {
  it("renders EditorInput component", async () => {
    render(
      <EditorInput
        field={["mock"]}
        isDisabled={false}
        index={0}
        isMultiValue={false}
      />,
      {},
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls updateValue change handler", async () => {
    render(
      <EditorInput
        field={["mock"]}
        isDisabled={false}
        updateValue={mockUpdateValue}
        index={0}
        isMultiValue={false}
      />,
      {},
    );

    await userEvent.type(screen.getByRole("textbox"), "2");

    expect(mockUpdateValue).toHaveBeenCalledWith(["mock2"]);
  });
});
