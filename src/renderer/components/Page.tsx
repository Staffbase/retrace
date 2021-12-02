import styled from "styled-components";
import React, { PropsWithChildren } from "react";

function useTitle(title?: string) {
  document.title = title ? `${title} - RE-Trace` : "RE-Trace";
}

export default function Page({
  id,
  title,
  children,
}: PropsWithChildren<{ id: string; title?: string }>) {
  useTitle(title);

  return (
    <StyledPage className={`page ${id}`}>
      {title && <StyledPageHeadline>{title}</StyledPageHeadline>}
      {children}
    </StyledPage>
  );
}

const StyledPage = styled.div`
  padding: 15px;
  background-color: var(--background);
  height: auto;
  min-height: 100vh;
`;

const StyledPageHeadline = styled.h3`
  margin: 0;
  color: var(--textLight);
`;
