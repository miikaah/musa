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
  margin: var(--toolbar-height) 0 0 -12px;
  overflow-y: auto;

  @media (max-width: ${breakpoint.xs}) {
    padding: 0 8px;
  }
`;

const BasePageWrapper = styled.div`
  padding: 40px;
  max-width: 730px;
  min-width: 344px;
  margin: 0 auto 50px;
  max-height: 95vh;
`;

const BasePage = React.forwardRef(({ children, isVisible }, ref) => {
  if (!isVisible) return null;
  return (
    <BasePageContainer ref={ref}>
      <BasePageWrapper>{children}</BasePageWrapper>
    </BasePageContainer>
  );
});

export default BasePage;
