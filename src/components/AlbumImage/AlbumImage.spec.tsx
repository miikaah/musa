import React from "react";
import { screen } from "@testing-library/react";
import AlbumImage from "./AlbumImage";
import { albumFixture } from "../Album/Album.fixture";
import { render } from "../../../test/render";
import { translate } from "../../i18n";

const state = {
  settings: { t: translate("en") },
};

describe("AlbumImage", () => {
  it("renders AlbumImage component", async () => {
    render(<AlbumImage item={albumFixture} />, state);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect((screen.getByRole("img") as HTMLImageElement).src).toBe(
      "media:///Maustetyto%CC%88t/Eiva%CC%88t%20enkelitka%CC%88a%CC%88n%20ilman%20siipia%CC%88%20lenna%CC%88/Eiva%CC%88t%20enkelitka%CC%88a%CC%88n%20ilman%20siipia%CC%88%20lenna%CC%88.jpg",
    );
  });
});
