import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import PlayerVolume from "./PlayerVolume";
import { render } from "../../../test/render";

const mockSetVolumeForStateAndPlayer = vi.fn();

const state = {
  settings: { volume: 50 },
};

describe("PlayerVolume", () => {
  it("renders PlayerVolume component", async () => {
    render(
      <PlayerVolume
        setVolumeForStateAndPlayer={mockSetVolumeForStateAndPlayer}
      />,
      state,
    );

    expect(screen.getByTestId("ProgressInput")).toBeInTheDocument();
  });

  it("calls setVolumeForStateAndPlayer click handler", async () => {
    render(
      <PlayerVolume
        setVolumeForStateAndPlayer={mockSetVolumeForStateAndPlayer}
      />,
      state,
    );

    fireEvent.mouseDown(screen.getByTestId("ProgressInput"));

    expect(mockSetVolumeForStateAndPlayer).toHaveBeenCalledOnce();
  });
});
