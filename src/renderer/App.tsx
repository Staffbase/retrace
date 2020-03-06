import React, { ReactElement, useCallback, useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/Store";
import Form from "./components/Form";
import styled from "styled-components";
import { ipcRenderer } from "electron";
import DetailView from "./components/DetailView";
import Mousetrap from "mousetrap";
import "mousetrap/plugins/global-bind/mousetrap-global-bind";

const App = (): ReactElement => {
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
    <Provider store={store}>
      <HBox>
        <Form closeAfterSubmit={isCollapsed} />
        <StyledToggleButton onClick={toggleCollapsed} />
      </HBox>

      {!isCollapsed && <DetailView />}
    </Provider>
  );
};

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

export default App;
