import { ArtistObject } from "@miikaah/musa-core";
import { scanColor } from "../config";

export const SET_LISTING_WITH_LABELS = "MUSA/LIBRARY/SET_LISTING_WITH_LABELS";
export type SetListingWithLabelsAction = {
  type: typeof SET_LISTING_WITH_LABELS;
  listingWithLabels: ArtistObject;
};
export const setListingWithLabels = (
  listingWithLabels: ArtistObject,
): SetListingWithLabelsAction => ({
  type: SET_LISTING_WITH_LABELS,
  listingWithLabels,
});

type ScanProps = {
  scanLength: number;
  scannedLength: number;
  scanColor: string;
  reset: boolean;
};

export const SET_SCAN_PROPS = "MUSA/LIBRARY/SET_SCAN_PROPS";
export type SetScanPropsAction = Partial<ScanProps> & {
  type: typeof SET_SCAN_PROPS;
};
export const setScanProps = ({
  scanLength,
  scannedLength,
  scanColor,
  reset,
}: Partial<ScanProps>): SetScanPropsAction => ({
  type: SET_SCAN_PROPS,
  scanLength,
  scannedLength,
  scanColor,
  reset,
});

export type LibraryState = {
  listingWithLabels: ArtistObject;
  scanLength: number;
  scannedLength: number;
  scanColor: string;
};

const initialState: LibraryState = {
  listingWithLabels: {},
  scanLength: -1,
  scannedLength: 0,
  scanColor: scanColor.INSERT_FILES,
};

type LibraryAction = SetListingWithLabelsAction | SetScanPropsAction;

const library = (state = initialState, action: LibraryAction) => {
  switch (action.type) {
    case SET_LISTING_WITH_LABELS: {
      return {
        ...state,
        listingWithLabels: action.listingWithLabels,
      };
    }
    case SET_SCAN_PROPS: {
      if (action.reset) {
        return {
          ...state,
          scanLength: initialState.scanLength,
          scannedLength: initialState.scannedLength,
          scanColor: scanColor.INSERT_FILES,
        };
      }
      return {
        ...state,
        scanLength: action.scanLength || state.scanLength,
        scannedLength: action.scannedLength || state.scannedLength,
        scanColor: action.scanColor || state.scanColor,
      };
    }
    default:
      return state;
  }
};

export default library;
