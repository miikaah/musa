import React from "react";
import { screen } from "@testing-library/react";
import PlayerTimeDisplay from "./PlayerTimeDisplay";
import { audioFixture } from "../../fixtures/audio.fixture";
import { render } from "../../../test/render";

describe("PlayerTimeDisplay", () => {
  it("renders PlayerTimeDisplay component", async () => {
    render(
      <PlayerTimeDisplay currentTime={100} currentItem={audioFixture} />,
      {},
    );

    expect(screen.getByTestId("TimeDisplayTimePlayed")).toBeInTheDocument();
    expect(screen.getByTestId("TimeDisplayTimePlayed").textContent).toBe(
      "1:40",
    );
    expect(screen.getByTestId("TimeDisplaySeparator")).toBeInTheDocument();
    expect(screen.getByTestId("TimeDisplayDuration").textContent).toBe("3:12");
  });
});
