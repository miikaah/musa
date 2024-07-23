import styled from "styled-components";

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
  width: 100%;
  border-radius: var(--border-radius);

  > div {
    display: flex;
    align-items: center;
    margin: 20px 20px 0;
    color: grey;
    font-size: var(--font-size-xs);
  }

  > button {
    max-width: 140px;
    margin: 10px 20px;
  }
`;
