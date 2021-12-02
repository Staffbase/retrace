/*
Copyright 2021, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
