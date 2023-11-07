import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import PlayerSeek from "./PlayerSeek";
import { audioFixture } from "../../fixtures/audio.fixture";
import { render } from "../../../test/render";

const mockSetCurrentTime = vi.fn();
const mockPlayer = {
  currentTime: 50,
} as any;

const state = {
  player: { isPlaying: true, currentItem: audioFixture },
};

describe("PlayerSeek", () => {
  it("renders PlayerSeek component", async () => {
    render(
      <PlayerSeek
        player={mockPlayer}
        duration={500}
        currentTime={50}
        setCurrentTime={mockSetCurrentTime}
      />,
      state,
    );

    expect(screen.getByTestId("ProgressInput")).toBeInTheDocument();
  });

  it("calls setCurrentTime click handler", async () => {
    render(
      <PlayerSeek
        player={mockPlayer}
        duration={500}
        currentTime={50}
        setCurrentTime={mockSetCurrentTime}
      />,
      state,
    );

    fireEvent.mouseDown(screen.getByTestId("ProgressInput"));

    expect(mockSetCurrentTime).toHaveBeenCalledOnce();
  });
});
