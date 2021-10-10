import React from "react";
import LibraryList from "./LibraryListV2";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { listOverflow } from "../common.styles";

const { REACT_APP_ENV } = process.env;
const isElectron = REACT_APP_ENV === "electron";

let ipc;
if (isElectron && window.require) {
  ipc = window.require("electron").ipcRenderer;
  /* eslint-disable no-console */
  ipc.on("musa:log", (event, log) => console.log("(main)", log));
  ipc.on("musa:error", (event, error) => console.error(error));
  /* eslint-enable no-console */
}

const LibraryContainer = styled.div`
  text-align: left;
  border: 0 solid var(--color-secondary-highlight);
  border-left-width: 4px;
  border-right-width: 1px;
  background-color: var(--color-bg);
  box-shadow: 25px 10px 31px -17px rgba(10, 10, 10, 0.75);
  position: absolute;
  min-width: 400px;
  z-index: 1;
  height: 100vh;
  margin-top: var(--titlebar-height);
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  padding-bottom: var(--toolbar-height);
  max-width: 80vw;
  ${listOverflow}
`;

const LibraryLabel = styled.div`
  text-align: right;
  padding: 20px;

  span {
    color: var(--color-typography-primary);
    background-color: var(--color-primary-highlight);
    padding: 5px 10px;
    font-size: 40px;
    border-radius: 3px;
  }
`;

const Library = ({ dispatch, forwardRef, isVisible, listingWithLabels }) => {
  return (
    <LibraryContainer ref={forwardRef} isVisible={isVisible}>
      {listingWithLabels &&
        Object.entries(listingWithLabels).map(([key, artist]) => (
          <div key={key}>
            <LibraryLabel>
              <span>{key}</span>
            </LibraryLabel>
            {artist.map((item, index) => (
              <LibraryList key={item.id} item={item} isArtist />
            ))}
          </div>
        ))}
    </LibraryContainer>
  );
};

const ConnectedLibrary = connect(
  (state) => ({
    listingWithLabels: state.library.listingWithLabels,
  }),
  (dispatch) => ({ dispatch })
)(Library);

export default React.forwardRef((props, ref) => (
  <ConnectedLibrary {...props} forwardRef={ref} />
));
