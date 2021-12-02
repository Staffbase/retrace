import React from "react";
import styled from "styled-components";
import { ipcRenderer } from "electron";
import { useTranslation } from "../../i18n";

export default function StatusBar() {
  const { PAGES } = useTranslation();

  return (
    <StyledStatusBar>
      <ActionButton
        onClick={() => {
          ipcRenderer.send("open-history");
        }}
      >
        {PAGES.logbook}
      </ActionButton>
      <ActionButton
        onClick={() => {
          ipcRenderer.send("open-settings");
        }}
      >
        {PAGES.settings}
      </ActionButton>
    </StyledStatusBar>
  );
}

const StyledStatusBar = styled.footer`
  background-color: var(--backgroundDark);
  border-top: 1px solid var(--backgroundDarker);
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 5px;
`;

const ActionButton = styled.button`
  appearance: none;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: var(--backgroundDarker);
  padding: 5px 10px;
  font-size: 10px;
  color: var(--text);
  background-color: var(--backgroundDark);
`;
