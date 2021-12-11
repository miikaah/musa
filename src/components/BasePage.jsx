import React from "react";
import styled from "styled-components/macro";

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
`;

const BasePageWrapper = styled.div`
  padding: 20px;
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
