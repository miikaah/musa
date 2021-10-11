import React from "react";
import styled from "styled-components/macro";
import { breakpoint } from "../breakpoints";

const BasePageContainer = styled.div`
  h1 {
    margin-bottom: 40px;
  }

  position: fixed;
  z-index: 2;
  background-color: var(--color-bg);
  height: 100%;
  width: 100%;
  margin-top: var(--titlebar-height);
  overflow-y: auto;

  @media (max-width: ${breakpoint.xs}) {
    padding: 0 8px;
  }
`;

const BasePageWrapper = styled.div`
  padding: 40px 20px;
  max-width: 960px;
  min-width: 344px;
  margin: 0 auto 50px;
`;

const BasePage = ({ children }) => {
  return (
    <BasePageContainer>
      <BasePageWrapper>{children}</BasePageWrapper>
    </BasePageContainer>
  );
};

export default BasePage;
