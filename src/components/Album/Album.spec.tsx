import React from "react";
import { screen } from "@testing-library/react";
import Album from "./Album";
import { albumFixture } from "./Album.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

it("renders Album component", async () => {
  render(<Album item={albumFixture} />, {
    settings: { t: translate("en") },
  });

  expect(
    screen.getByTitle(String(albumFixture.metadata.album)),
  ).toBeInTheDocument();
  expect(
    screen.getByText(String(albumFixture.metadata.artist)),
  ).toBeInTheDocument();
  expect(
    screen.getByText(String(albumFixture.metadata.year)),
  ).toBeInTheDocument();
});
