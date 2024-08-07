import React from "react";
import { screen } from "@testing-library/react";
import LibraryItem from "./LibraryItem";
import { albumFixture } from "../../fixtures/album.fixture";
import { render } from "../../../test/render";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

const audio = albumFixture.files[0];
const title = String(audio.metadata?.title);

describe("LibraryItem", () => {
  it("renders LibraryItem component", async () => {
    render(<LibraryItem item={audio} />, {});

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
