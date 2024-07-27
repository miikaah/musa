import { ArtistObject } from "@miikaah/musa-core";
import { scanColor } from "../config";

export const SET_LISTING_WITH_LABELS =
  "MUSA/LIBRARY/SET_LISTING_WITH_LABELS" as const;
export const setListingWithLabels = (listingWithLabels: ArtistObject) => ({
  type: SET_LISTING_WITH_LABELS,
  listingWithLabels,
});

type ScanProps = {
  scanLength: number;
  scannedLength: number;
  scanColor: string;
  reset: boolean;
};

export const SET_SCAN_PROPS = "MUSA/LIBRARY/SET_SCAN_PROPS" as const;
export const setScanProps = ({
  scanLength,
  scannedLength,
  scanColor,
  reset,
}: Partial<ScanProps>) => ({
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

type LibraryAction =
  | ReturnType<typeof setListingWithLabels>
  | ReturnType<typeof setScanProps>;

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
