import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Library from "./Library";
import { artistObjectFixture } from "../../fixtures/artistObject.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const t = translate("en");
const filterPlaceholder = String(t("library.filter.placeholder"));

const state = {
  library: { listingWithLabels: artistObjectFixture },
  settings: { t },
};

describe("Library", () => {
  it("renders Library component", async () => {
    render(<Library libraryMode="library" />, state);

    expect(screen.getByPlaceholderText(filterPlaceholder)).toBeInTheDocument();
    expect(screen.getByText(artistObjectFixture.A[0].name)).toBeInTheDocument();
    expect(screen.getByText(artistObjectFixture.R[0].name)).toBeInTheDocument();
  });

  it("renders Visualizer component", async () => {
    render(<Library libraryMode="visualizer" />, state);

    expect(screen.getByTestId("VisualizerContainer")).toBeInTheDocument();
  });

  it("types to artist filter and clears it", async () => {
    render(<Library libraryMode="library" />, state);

    await userEvent.type(screen.getByPlaceholderText(filterPlaceholder), "A");

    expect(screen.getByPlaceholderText(filterPlaceholder)).toHaveValue("A");

    await userEvent.click(screen.getByTestId("LibraryFilterClearButton"));

    expect(screen.getByPlaceholderText(filterPlaceholder)).toHaveValue("");
  });
});
