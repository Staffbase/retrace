import Form from "../components/Form";
import DetailView from "../components/DetailView";
import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import { ipcRenderer } from "electron";
import Mousetrap from "mousetrap";

export default function MainView() {
  const [isCollapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    ipcRenderer.send(`window-${isCollapsed ? "collapse" : "expand"}`);
  }, [isCollapsed]);

  useEffect(() => {
    ipcRenderer.on("window-collapse", () => {
      setCollapsed(true);
    });

    ipcRenderer.on("window-expand", () => {
      setCollapsed(false);
    });

    // close window via ESC key
    Mousetrap.bindGlobal("esc", () => {
      ipcRenderer.send("close-window");
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <div className="page main">
      <HBox>
        <Form closeAfterSubmit={isCollapsed} />
        <StyledToggleButton onClick={toggleCollapsed} />
      </HBox>

      {!isCollapsed && <DetailView />}
    </div>
  );
}

const HBox = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--backgroundDark);
`;

const StyledToggleButton = styled.button`
  flex: 0 0 auto;
  appearance: none;
  background-color: transparent;
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: var(--logo);
  width: 47px;
  border: none;
  outline: none;
`;
