import React from "react";
import { screen } from "@testing-library/react";
import Toaster from "./Toaster";
import { render } from "../../../test/render";

const message1 = "message1";
const message2 = "message2";

const state = {
  toaster: {
    messages: {
      key1: message1,
      key2: message2,
    },
  },
};

const state2 = {
  toaster: {
    messages: {},
  },
};

describe("Toaster", () => {
  it("renders Toaster component", async () => {
    render(<Toaster />, state);

    expect(screen.getByText(message1)).toBeInTheDocument();
    expect(screen.getByText(message2)).toBeInTheDocument();
  });

  it("does not render messages when no messages", async () => {
    render(<Toaster />, state2);

    expect(screen.queryByText(message1)).not.toBeInTheDocument();
    expect(screen.queryByText(message2)).not.toBeInTheDocument();
  });
});
