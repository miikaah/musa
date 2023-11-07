import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagTextarea from "./TagTextarea";
import { render } from "../../../test/render";

const mockUpdateValue = vi.fn();

describe("TagTextarea", () => {
  it("renders TagTextarea component", async () => {
    render(
      <TagTextarea
        field="mock"
        isDisabled={false}
        updateValue={mockUpdateValue}
      />,
      {},
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls updateValue change handler", async () => {
    render(
      <TagTextarea
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
