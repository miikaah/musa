import React, { useEffect } from "react";
import LibraryList from "./LibraryListV2";
import { isEmpty } from "lodash-es";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { setListingWithLabels } from "reducers/library.reducer";
import { listOverflow } from "../common.styles";

const LibraryContainer = styled.div`
  text-align: left;
  border: 0 solid var(--color-secondary-highlight);
  border-left-width: 4px;
  border-right-width: 1px;
  background-color: var(--color-bg);
  box-shadow: 25px 10px 31px -17px rgba(10, 10, 10, 0.75);
  position: absolute;
  min-width: 400px;
  z-index: 11;
  height: 100vh;
  margin-top: var(--toolbar-height);
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  padding-bottom: 40px;
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
  useEffect(() => {
    fetch("http://100.79.27.108:4200/artists")
      .then((response) => response.json())
      .then((artists) => {
        dispatch(setListingWithLabels(artists));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LibraryContainer ref={forwardRef} isVisible={isVisible}>
      {listingWithLabels &&
        Object.keys(listingWithLabels).map((key) => {
          if (isEmpty(listingWithLabels[key])) return null;
          return (
            <div key={key}>
              <LibraryLabel>
                <span>{key}</span>
              </LibraryLabel>
              {listingWithLabels[key].map((item, index) => (
                <LibraryList key={item.id} item={item} isArtist />
              ))}
            </div>
          );
        })}
    </LibraryContainer>
  );
};

const ConnectedLibrary = connect(
  (state) => ({
    listing: state.library.listing,
    listingWithLabels: state.library.listingWithLabels,
  }),
  (dispatch) => ({ dispatch })
)(Library);

export default React.forwardRef((props, ref) => (
  <ConnectedLibrary {...props} forwardRef={ref} />
));
