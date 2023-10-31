import React from "react";
import styled from "styled-components";

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

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 100vw;
    max-width: 100vw;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const BasePageWrapper = styled.div<{ setMaxWidth: boolean }>`
  padding: 20px 20px 160px;
  max-width: ${({ setMaxWidth }) => setMaxWidth && "960px"};
  min-width: 344px;
  margin: 0 auto 50px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: unset;
    max-width: 100vw;
    padding: 10px 10px 160px;
    margin: 0;
    overflow: hidden;
  }
`;

type BasePageProps = {
  children?: React.ReactNode;
  setMaxWidth?: boolean;
};

const BasePage = ({ children, setMaxWidth = true }: BasePageProps) => {
  return (
    <BasePageContainer>
      <BasePageWrapper setMaxWidth={setMaxWidth}>{children}</BasePageWrapper>
    </BasePageContainer>
  );
};

export default BasePage;
