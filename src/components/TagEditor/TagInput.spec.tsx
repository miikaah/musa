import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "./TagInput";
import { render } from "../../../test/render";

const mockUpdateValue = vi.fn();

describe("TagInput", () => {
  it("renders TagInput component", async () => {
    render(<TagInput field="mock" isDisabled={false} />, {});

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls updateValue change handler", async () => {
    render(
      <TagInput
        field="mock"
        isDisabled={false}
        updateValue={mockUpdateValue}
      />,
      {},
    );

    await userEvent.type(screen.getByRole("textbox"), "2");

    expect(screen.getByRole("textbox")).toHaveValue("mock2");
    expect(mockUpdateValue).toHaveBeenCalledWith("mock2");
  });
});
