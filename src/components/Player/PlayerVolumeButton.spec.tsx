import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerVolumeButton, { VOLUME_STEP } from "./PlayerVolumeButton";
import { render } from "../../../test/render";

const mockMuteOrUnmute = vi.fn();

describe("PlayerVolumeButton", () => {
  it("renders PlayerVolumeButton component", async () => {
    render(
      <PlayerVolumeButton volume={42} muteOrUnmute={mockMuteOrUnmute} />,
      {},
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders volume up icon when is not muted", async () => {
    render(
      <PlayerVolumeButton volume={42} muteOrUnmute={mockMuteOrUnmute} />,
      {},
    );

    expect(screen.getByTestId("PlayerVolumeButtonIcon")).toHaveClass(
      "fa-volume-up",
    );
  });

  it("renders volume mute icon when is muted", async () => {
    render(
      <PlayerVolumeButton
        volume={VOLUME_STEP - 1}
        muteOrUnmute={mockMuteOrUnmute}
      />,
      {},
    );

    expect(screen.getByTestId("PlayerVolumeButtonIcon")).toHaveClass(
      "fa-volume-mute",
    );
  });

  it("calls muteOrUnmute click handler", async () => {
    render(
      <PlayerVolumeButton volume={42} muteOrUnmute={mockMuteOrUnmute} />,
      {},
    );

    await userEvent.click(screen.getByRole("button"));

    expect(mockMuteOrUnmute).toHaveBeenCalledOnce();
  });
});
