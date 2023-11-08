import reducer, { setListingWithLabels, setScanProps } from "./library.reducer";
import { artistObjectFixture } from "../fixtures/artistObject.fixture";
import { scanColor } from "../config";

const initialScanProps = {
  scanLength: -1,
  scannedLength: 0,
  scanColor: scanColor.INSERT_FILES,
};

const scanProps = {
  scanLength: 100,
  scannedLength: 10,
  scanColor: scanColor.UPDATE_FILES,
};

describe("Library reducer", () => {
  it("updates listing with labels", () => {
    expect(
      reducer(undefined, setListingWithLabels(artistObjectFixture)),
    ).toEqual({
      listingWithLabels: artistObjectFixture,
      ...initialScanProps,
    });
  });

  it("sets scan props", () => {
    expect(reducer(undefined, setScanProps(scanProps))).toEqual({
      listingWithLabels: {},
      ...scanProps,
    });
  });

  it("resets scan props", () => {
    expect(
      reducer(
        { listingWithLabels: artistObjectFixture, ...scanProps },
        setScanProps({ reset: true }),
      ),
    ).toEqual({
      listingWithLabels: artistObjectFixture,
      ...initialScanProps,
    });
  });
});
