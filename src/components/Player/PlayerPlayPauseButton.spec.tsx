import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerPlayPauseButton from "./PlayerPlayPauseButton";
import { render } from "../../../test/render";

const mockPlayOrPause = vi.fn();

const state = {
  player: { isPlaying: false },
};

const state2 = {
  player: { isPlaying: true },
};

describe("PlayerPlayPauseButton", () => {
  it("renders PlayerPlayPauseButton component", async () => {
    render(<PlayerPlayPauseButton playOrPause={mockPlayOrPause} />, state);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders play icon when not playing", async () => {
    render(<PlayerPlayPauseButton playOrPause={mockPlayOrPause} />, state);

    expect(screen.getByTestId("PlayerPlayPauseButtonIcon")).toHaveClass(
      "fa-play",
    );
  });

  it("renders pause icon when playing", async () => {
    render(<PlayerPlayPauseButton playOrPause={mockPlayOrPause} />, state2);

    expect(screen.getByTestId("PlayerPlayPauseButtonIcon")).toHaveClass(
      "fa-pause",
    );
  });

  it("calls playOrPause click handler", async () => {
    render(<PlayerPlayPauseButton playOrPause={mockPlayOrPause} />, state);

    await userEvent.click(screen.getByRole("button"));

    expect(mockPlayOrPause).toHaveBeenCalledOnce();
  });
});
